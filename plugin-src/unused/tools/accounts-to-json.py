import requests
import json
import sys
import argparse
from random import randint, shuffle
import logging, coloredlogs
import time

serverList = ["USEast2","USSouthWest","USMidWest","EUWest2","USSouth",
              "EUWest","USWest4","USEast4","USEast3","Australia","USNorthWest",
              "USSouth2","EUSouthWest","USWest2","USSouth3","USEast",
              "AsiaSouthEast","EUNorth2","USWest","EUEast2","USMidWest2","EUSouth",
              "EUEast","AsiaEast","USWest3","EUNorth"]

serverList = sorted(serverList, key=str.lower)
useProxies = True

parser = argparse.ArgumentParser()
parser.add_argument("--useproxies", action="store", default="true", help="whether to use proxies [true/false]")
parser.add_argument("--setserver", action="store", default="EUWest2", help="the default rotmg server to connect all accounts to")
parser.add_argument("--pathfinder", action="store", default=True, help="whether to enable or disable pathfinder")
parser.add_argument("--proxyfile", action="store", default=None, help="the name of a proxyfile to use")
parser.add_argument("--shuffleservers", action="store", default=None, help="use random servers for each account")

args = parser.parse_args()

if args.shuffleservers is not None:
    shuffle(serverList)

try:
    f = open('accounts.txt', 'r')
    accounts = f.readlines()
except FileNotFoundError:
    print('Could not find an accounts.txt file!')
    sys.exit(0)

serverCount = len(serverList)-1

accObject = []
count = 0
serverCounter = 0
shuffle(accounts)

for account in accounts:
    accData = account.split(':')
    #if useProxies:
        #proxy = proxyList[randint(0,proxyCount-1)]
        #proxyData = proxy.split(':')

        #if len(proxyData) != 2:
            #print('proxydata failed with ' + proxyData[0])

    newAcc = {
        "alias": "{}".format(count),
        "guid": accData[0],
        "password": accData[1].strip('\n'),
        "serverPref": serverList[serverCounter],
        "pathfinder": args.pathfinder,
        #"proxy": {
            #"host": "p.webshare.io",
            #"port": 1080,
            #"username": "kswlywgu-rotate",
            #"password": "sbh7v2ksgpu8",
            #"type": 5
        #}
    }
    if serverCounter == 25:
        serverCounter = 0
    else:
        serverCounter += 1
    count += 1
    accObject.append(newAcc)

jsonObject = json.dumps(accObject, indent=4)

print(jsonObject)

write = open('accounts.json', 'w')
write.write(jsonObject)