import {EventResponse} from '../../models/general'

export function parseRealmChat(message: string): EventResponse {
    // CLOSED REALM
    if (message.includes('I HAVE CLOSED THIS REALM! YOU WILL NOT LIVE TO SEE THE LIGHT OF DAY!')) {
        return {
            type: 'closed',
            color: '',
            image: ''
        }
    }

    // LAST LICH
    if (message.includes('My final Lich shall consume your souls!') || message.includes('My final Lich will protect me forever!')) {
        return {
            type: 'event',
            channel: '725694278059294770',
            color: '',
            name: 'Last Lich',
            image: ''
        }
    }

    // CUBE GOD
    if (message.includes('Your meager abilities cannot possibly challenge a Cube God!')) {
        return {
            type: 'event',
            channel: '725695914764927055',
            color: '',
            name: 'Cube God',
            image: ''
        }
    }

    // SKULL SHRINE
    if (message.includes('Your futile efforts are no match for a Skull Shrine!')) {
        return {
            type: 'event',
            channel: '725695899384414238',
            color: '',
            name: 'Skull Shrine',
            image: ''
        }
    }

    // KEYPER
    if (message.includes('Hands off those crystals! I need them to scrounge up more keys!') || message.includes('Wha- Again? REALLY?!')) {
        return {
            type: 'event',
            channel: '725695262458249229',
            color: '',
            name: 'The Keyper',
            image: ''
        }
    }
    if (message.includes('Ah, there we go! Let’s see those lowlifes try to take down my crystals this time!')) {
        return {
            type: 'event',
            channel: '725695262458249229',
            color: '',
            name: 'Keyper Crystals',
            image: ''
        }
    }

    // ALIENS
    if (message.includes('A possible ally from far away has arrived to eradicate you vexatious brutes!') ||
        message.includes('Invaders in my realm?! Perhaps these could serve as fresh minions!')) {
        return {
            type: 'event',
            channel: '725696239147941908',
            color: '',
            name: 'Aliens',
            image: ''
        }
    }

    // LOST SENTRY
    if (message.includes('What is this? A subject has broken free from those wretched halls!') ||
        message.includes('That lowly Paladin has escaped the Lost Halls with a vessel!') ||
        message.includes('The catacombs have been unearthed?! What depraved souls have survived so long?')) {
        return {
            type: 'event',
            channel: '725696198060539944',
            color: '',
            name: 'Lost Sentry',
            image: ''
        }
    }

    // LORD OF THE LOST LANDS
    if (message.includes('Cower in fear of my Lord of the Lost Lands!') || message.includes('My Lord of the Lost Lands will make short work of you!')) {
        return {
            type: 'event',
            channel: '725695788390285332',
            color: '',
            name: 'Lord of the Lost Lands',
            image: ''
        }
    }

    // GRAND SPHINX
    if (message.includes('At last, a Grand Sphinx will teach you to respect!')) {
        return {
            type: 'event',
            channel: '725695828718649405',
            color: '',
            name: 'Grand Sphinx',
            image: ''
        }
    }

    // HERMIT GOD
    if (message.includes('My Hermit God\'s thousand tentacles shall drag you to a watery grave!')) {
        return {
            type: 'event',
            channel: '725695855247753236',
            color: '',
            name: 'Hermit God',
            image: ''
        }
    }

    // GHOST SHIP
    if (message.includes('A Ghost Ship has entered the Realm.') || message.includes('My Ghost Ship will terrorize you pathetic peasants!')) {
        return {
            type: 'event',
            channel: '725695953918754928',
            color: '',
            name: 'Ghost Ship',
            image: ''
        }
    }

    // BEE NEST
    if (message.includes('The Killer Queen Bee has made her nest in the realm!') ||
        message.includes('Beehold the Killer Bee Nest! Not even the sturdiest armor or most powerful healing spell will save you now!') ||
        message.includes('My horde of insects will easily obliterate you lowbrow pests!') ||
        message.includes('You obtuse half-wits stand no chance against the Killer Bee Queen and her children!')) {
        return {
            type: 'event',
            channel: '725745014193389629',
            color: '',
            name: 'Killer Bee Nest',
            image: ''
        }
    }

    // AVATAR
    if (message.includes('The Shatters has been discovered!?!') || message.includes('The Forgotten King has raised his Avatar!')) {
        return {
            type: 'event',
            channel: '725696003516137483',
            color: '',
            name: 'Avatar of the Forgotten King',
            image: ''
        }
    }

    // PENTARACT
    if (message.includes('Behold my Pentaract, and despair!')) {
        return {
            type: 'event',
            channel: '725696069375361096',
            color: '',
            name: 'Pentaract',
            image: ''
        }
    }

    // BEACH BUM
    if (message.includes('An elusive Beach Bum is hiding somewhere in the Realm.') || message.includes('What is this lazy Beach Bum doing in my Realm?!')) {
        return {
            type: 'event',
            channel: '736224533949710367',
            color: '',
            name: 'Beach Bum',
            image: ''
        }
    }
}