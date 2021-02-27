import sys
import os
import json
import xml.etree.ElementTree as ET

url = "https://realmofthemadgod.appspot.com/char/list"
serverlist = {}
try:
    with open("servers.xml", 'r') as file:
        xml = file.read()
        root = ET.fromstring(xml)
except FileNotFoundError:
    import requests
    req = requests.get(url)
    servstart = req.text.index("<Servers>")
    servend = req.text.index("</Servers>") + 10
    xml = req.text[servstart:servend]
    root = ET.fromstring(xml)

servers = root.findall("Server")
for server in servers:
    serverlist[server.find("Name").text] = server.find("DNS").text


sortedlist = {}
for key in sorted(serverlist.keys()):
    sortedlist[key] = serverlist[key]

formatted = json.dumps({"Servers": sortedlist}, indent="    ")

print(formatted)
with open("servers.json", "w") as file:
    file.write(formatted)