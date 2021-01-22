import requests
from bs4 import BeautifulSoup as bs

links = ["http://www.j-archive.com/showgame.php?game_id=6823"]
r = requests.get(links.pop(0))
soup = bs(r.content, 'html.parser')
print(soup.prettify())