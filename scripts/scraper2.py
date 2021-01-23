import requests
from bs4 import BeautifulSoup as bs
import re

links = ["http://www.j-archive.com/showgame.php?game_id=6824"]
r = requests.get(links.pop(0))
soup = bs(r.content, 'html.parser')
dtable = soup.find(id="double_jeopardy_round").table
cards_soup = dtable.find_all("td", class_="clue")
hints = []
while cards_soup:
    card_soup = cards_soup.pop(0)
    card_text = card_soup.find(class_="clue_text")
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
        hints.append(hint)
    else:
        hints.append(None)

print(hints)
