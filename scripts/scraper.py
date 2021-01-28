import requests
from bs4 import BeautifulSoup as bs
import re
import json
import sys
import time

def main(args):
    num_seasons = int(args[0])
    num_matches = int(args[1])
    file_name = args[2]
    delay = float(args[3])
    web_root = "http://www.j-archive.com/"

    # Extract the desired number of seasons into season links
    season_links = []
    data = {}
    main_request = requests.get("http://www.j-archive.com/")
    seasons_soup = bs(main_request.content, 'html.parser').find(href='listseasons.php').parent.find_all('a')
    while seasons_soup and num_seasons > 0:
        season_links.append(web_root + seasons_soup.pop()['href'])
        num_seasons -= 1

    # Run through seasons and pull out desired number of matches, pairing with season number
    matches = [] # [season, match_link]
    while season_links:
        num_matches = int(args[1])
        season_request = requests.get(season_links.pop())
        soup = bs(season_request.content, 'html.parser')
        season = get_season(soup.title.string)
        rows = soup.find_all('tr')
        while rows and num_matches > 0:
            row = rows.pop()
            matches.append([season, row.a['href']])
            num_matches -= 1
    # Extract data from each match, adding into data dictionary
    while matches:
        # Create new season in data if it doesn't exist
        match = matches.pop()
        match_season = match[0]
        if not match_season in data:
            data[match_season] = []
            print(f'Starting season #{match_season}')
        season_list = data[match_season]

        # Get html from match page
        match_link = match[1]
        r = requests.get(match_link)
        soup = bs(r.content, 'html.parser')

        # Pull out match number and match date from <title> in html
        title = str(soup.title.string)
        match_number = get_match_number(title)
        match_date = get_date(title)

        # Create frames dictionary
        frames = {}

        # Pull out info from single, double, and final Jeopardy
        single_jeopardy = soup.find(id="jeopardy_round")
        if single_jeopardy:
            frames['single'] = get_category(single_jeopardy.table, False)
        else:
            frames['single'] = None
        double_jeopardy = soup.find(id="double_jeopardy_round")
        if double_jeopardy:
            frames['double'] = get_category(double_jeopardy.table, False)
        else:
            frames['double'] = None
        final_jeopardy = soup.find(id="final_jeopardy_round")
        if final_jeopardy:
            frames['final'] = get_category(final_jeopardy.table, True)
        else:
            frames['final'] = None

        # Add match dict to appropriate season
        season_list.append(make_match(match_number, match_date, frames))

        # Delay so not to bother the site
        time.sleep(delay)

        # Inform result of scrape
        print(f'Match #{match_number}  {match_date}: DONE')
        

    # Print result and inform completition of match
    with open(file_name, 'w') as f:
        f.write(json.dumps(data, indent=4))

def get_match_number(title):
    match_num = re.search("#.*,", title)
    if(match_num):
        return match_num.group()[1:-1]
    else:
        return "!Error!: Unable to parse match number"

def get_date(title):
    date_string = re.search("....-..-..", title)
    if(date_string):
        return date_string.group()
    else:
        return "!Error!: Unable to parse date"

def get_season(title):
    match = re.search("[0-9]+", title)
    if(match):
        return match.group()
    else:
        return "!Error!: Unable to parse season"

def make_match(id, date, frames):
    match = {
        "id": id,
        "date": date,
        "frames": frames
    }
    return match


def get_hint(card_soup):
    card_text = card_soup.find(class_="clue_text")
    hint = ''
    if(card_text):
        if(len(list(card_text.children)) > 1):
            result = []
            children = card_text.children
            for child in children:
                if(child.name):
                    if(child.name == 'br'):
                        result.append('<br>')
                    else:
                        result.append(child.get_text())
                else:
                    result.append(str(child.string))
            hint = ''.join(result)
        else:
            hint = card_text.get_text()

        # Condense multiple spaces
        hint = re.sub(r'\ +', ' ', hint)
    else:
        hint = None
    return hint

# Returns a list of the categories and nested cards within them
def get_category(table, is_final):
    categories_list = []
    categories_soup = table.find_all("td", class_="category")
    cards_soup = table.find_all("td", class_="clue")
    if is_final:
        cards_soup = [table]

    # Set up categories
    while categories_soup:
        category = {}
        category_soup = categories_soup.pop(0)
        category["name"] = category_soup.find(class_="category_name").get_text()
        category["comments"] = category_soup.find(class_="category_comments").string
        category["cards"] = []
        categories_list.append(category)

    # Load in cards
    pos = 1
    while cards_soup:
        for category in categories_list:

            # Load card hint
            card_soup = cards_soup.pop(0)
            hint = get_hint(card_soup)
            card = {
                "position": pos,
                "hint": hint
            }
            # Load card answer
            answer_text_soup = card_soup.find("div")
            answer_regex = re.compile(r'''
                    (?:<em\ class="correct_response">|<em\ class=\\"correct_response\\">)
                    (?:<i>)?
                    (?:")?
                    (.+?)
                    (?:")?
                    (?:</i>)?
                    (?:</em>)
                ''', re.VERBOSE)
            if answer_text_soup:
                answer_text = re.search(answer_regex, answer_text_soup["onmouseover"])
                if answer_text:
                    card["answer"] = answer_text.group(1).replace("<i>", "").replace("</i>", "").replace("<I>", "").replace("</I>", "").replace("<b>", "").replace("</b>", "").replace("\\'", "'")
                else:
                    card["answer"] = "!Error!: Unable to parse answer" # Represents inability to pull out answer
            else:
                card["answer"] = None # Represents no answer
            category["cards"].append(card)

            # Load whether card is double jeopardy
            daily_double_soup = card_soup.find(class_="clue_value_daily_double")
            if daily_double_soup:
                card["double"] = True
            else:
                card["double"] = False
        pos = pos + 1
    return categories_list

if __name__ == "__main__":
   main(sys.argv[1:])
