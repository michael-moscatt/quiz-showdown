import requests
from bs4 import BeautifulSoup as bs
import re
import json

def get_match_number(title):
    match_num = re.search("#.*,", title)
    if(match_num):
        return match_num.group()[1:-1]
    else:
        print(f'No \'match number\' found in {title}')
        return "0"

def get_date(title):
    date_string = re.search("....-..-..", title)
    if(date_string):
        return date_string.group()
    else:
        print(f'No \'date\' found in {title}')
        return "0000-00-00"

def get_season(title):
    match = re.search("\d", title)
    if(match):
        return match.group()
    else:
        print(f'No \'season\' found in {title}')
        return "0"

def make_match(id, date, frames):
    match = {
        "id": id,
        "date": date,
        "frames": frames
    }
    return match

# Returns a list of the categories and nested cards within them
def get_category(table):
    categories_list = []
    categories_soup = table.find_all("td", class_="category")
    cards_soup = table.find_all("td", class_="clue")

    # Set up categories
    while categories_soup:
        category = {}
        category_soup = categories_soup.pop(0)
        category["name"] = category_soup.find(class_="category_name").string
        category["comments"] = category_soup.find(class_="category_comments").string
        category["cards"] = []
        categories_list.append(category)

    # Load in cards
    while cards_soup:
        pos = 1
        for category in categories_list:
            # Load card hint
            card_soup = cards_soup.pop(0)
            card = {
                "position": pos
            }
            card_text = card_soup.find(class_="clue_text")
            if(card_text):
                card["hint"] = card_text.string
            else:
                card["hint"] = None # Represents no card

            # Load card answer
            answer_text_soup = card_soup.find("div")
            if answer_text_soup:
                print("hi")
                answer_text = re.search("correct_response&quot;&gt;&quot;.*&quot;&lt;", answer_text_soup["onmouseover"])
                card["answer"] = answer_text
            else:
                print("yo")
                card["answer"] = None # Represents no answer
            category["cards"].append(card)
        pos +=1


    return categories_list

season_links = ["http://www.j-archive.com/showseason.php?season=1"]
matches = [] # [season, match_link]
data = {}

# Run through seasons and pull out all matches, pairing with season number
while len(season_links) > 0:
    r = requests.get(season_links.pop(0))
    soup = bs(r.content, 'html.parser')
    season = get_season(soup.title.string)
    rows = soup.find_all('tr')
    for row in rows:
        matches.append([season, row.a['href']])

n = 1

# Extract data from each match, adding into data dictionary
while matches and n <= 3:
    # Create new season in data if it doesn't exist
    match = matches.pop()
    match_season = match[0]
    if not match_season in data:
        data[match_season] = []
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
    frames['single'] = get_category(soup.find(id="jeopardy_round").table)
    frames['double'] = get_category(soup.find(id="double_jeopardy_round").table)
    frames['final'] = get_category(soup.find(id="final_jeopardy_round").table)

    # Add match dict to appropriate season
    season_list.append(make_match(match_number, match_date, frames))

    n += 1

# Print result
print(json.dumps(data, indent=4))

# print(f'Season {match_season} - Match #{match_number} on {match_date}')