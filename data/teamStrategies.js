export const teamStrategies = {
    blacklist: {
        name: 'Blacklist International',
        preferredPicks: ['Estes', 'Mathilda', 'Beatrix', 'Valentina', 'Khufra', 'Lancelot', 'Paquito', 'Esmeralda', 'Julian', 'Kagura'],
        commonBans: ['Fredrinn', 'Joy', 'Arlott', 'Mathilda', 'Valentina'],
        playstyle: 'defensive',
        lateGameFocus: true,
        rolePreference: {
            jungler: ['Lancelot', 'Aamon', 'Ling'],
            midlane: ['Valentina', 'Kagura', 'Yve'],
            exp: ['Esmeralda', 'Paquito', 'Yu Zhong'],
            roam: ['Mathilda', 'Khufra', 'Atlas'],
            gold: ['Beatrix', 'Karrie', 'Brody']
        }
    },
    echo: {
        name: 'Team Liquid Echo Philippines',
        preferredPicks: ['Fanny', 'Chou', 'Ling', 'Lolita', 'Beatrix', 'Xavier', 'Lylia', 'Khufra', 'Yve', 'Karrie'],
        commonBans: ['Valentina', 'Julian', 'Fredrinn', 'Mathilda', 'Ling'],
        playstyle: 'aggressive',
        lateGameFocus: false,
        rolePreference: {
            jungler: ['Fanny', 'Ling', 'Hayabusa'],
            midlane: ['Xavier', 'Lylia', 'Yve'],
            exp: ['Chou', 'Paquito', 'Arlott'],
            roam: ['Lolita', 'Khufra', 'Franco'],
            gold: ['Beatrix', 'Melissa', 'Brody']
        }
    },
    onic: {
        name: 'Fanatic ONIC Philippines',
        preferredPicks: ['Hayabusa', 'Julian', 'Atlas', 'Yve', 'Melissa', 'Valentina', 'Esmeralda', 'Beatrix', 'Khufra', 'Chou'],
        commonBans: ['Ling', 'Mathilda', 'Joy', 'Fredrinn', 'Fanny'],
        playstyle: 'aggressive',
        lateGameFocus: false,
        rolePreference: {
            jungler: ['Hayabusa', 'Julian', 'Aamon'],
            midlane: ['Yve', 'Valentina', 'Xavier'],
            exp: ['Esmeralda', 'Paquito', 'Chou'],
            roam: ['Atlas', 'Khufra', 'Mathilda'],
            gold: ['Melissa', 'Beatrix', 'Karrie']
        }
    },
    ap: {
        name: 'Falcons AP Bren',
        preferredPicks: ['Ling', 'Beatrix', 'Mathilda', 'Valentina', 'Esmeralda', 'Lolita', 'Julian', 'Aamon', 'Karrie', 'Atlas'],
        commonBans: ['Fanny', 'Joy', 'Fredrinn', 'Arlott', 'Mathilda'],
        playstyle: 'aggressive',
        lateGameFocus: true,
        rolePreference: {
            jungler: ['Ling', 'Aamon', 'Julian'],
            midlane: ['Valentina', 'Xavier', 'Lylia'],
            exp: ['Esmeralda', 'Yu Zhong', 'Paquito'],
            roam: ['Mathilda', 'Lolita', 'Atlas'],
            gold: ['Beatrix', 'Karrie', 'Melissa']
        }
    },
    tnc: {
        name: 'TNC',
        preferredPicks: ['Joy', 'Lancelot', 'Franco', 'Yve', 'Melissa', 'Khufra', 'Valentina', 'Paquito', 'Beatrix', 'Atlas'],
        commonBans: ['Ling', 'Mathilda', 'Fredrinn', 'Fanny', 'Julian'],
        playstyle: 'aggressive',
        lateGameFocus: false,
        rolePreference: {
            jungler: ['Joy', 'Lancelot', 'Aamon'],
            midlane: ['Yve', 'Valentina', 'Xavier'],
            exp: ['Paquito', 'Chou', 'Yu Zhong'],
            roam: ['Franco', 'Khufra', 'Atlas'],
            gold: ['Melissa', 'Beatrix', 'Brody']
        }
    },
    aurora: {
        name: 'Aurora MLBB',
        preferredPicks: ['Aamon', 'Julian', 'Atlas', 'Xavier', 'Melissa', 'Mathilda', 'Esmeralda', 'Beatrix', 'Khufra', 'Arlott'],
        commonBans: ['Ling', 'Fanny', 'Joy', 'Fredrinn', 'Valentina'],
        playstyle: 'aggressive',
        lateGameFocus: true,
        rolePreference: {
            jungler: ['Aamon', 'Julian', 'Lancelot'],
            midlane: ['Xavier', 'Yve', 'Lylia'],
            exp: ['Esmeralda', 'Arlott', 'Paquito'],
            roam: ['Atlas', 'Mathilda', 'Khufra'],
            gold: ['Melissa', 'Beatrix', 'Karrie']
        }
    },
    rsg: {
        name: 'RSG Philippines',
        preferredPicks: ['Ling', 'Paquito', 'Lolita', 'Yve', 'Karrie', 'Atlas', 'Valentina', 'Esmeralda', 'Beatrix', 'Mathilda'],
        commonBans: ['Fanny', 'Joy', 'Julian', 'Fredrinn', 'Arlott'],
        playstyle: 'aggressive',
        lateGameFocus: true,
        rolePreference: {
            jungler: ['Ling', 'Hayabusa', 'Aamon'],
            midlane: ['Yve', 'Valentina', 'Xavier'],
            exp: ['Paquito', 'Esmeralda', 'Yu Zhong'],
            roam: ['Lolita', 'Atlas', 'Mathilda'],
            gold: ['Karrie', 'Beatrix', 'Melissa']
        }
    },
    omg: {
        name: 'Smart Omega',
        preferredPicks: ['Hayabusa', 'Chou', 'Franco', 'Xavier', 'Beatrix', 'Khufra', 'Valentina', 'Julian', 'Melissa', 'Mathilda'],
        commonBans: ['Ling', 'Fanny', 'Joy', 'Fredrinn', 'Arlott'],
        playstyle: 'aggressive',
        lateGameFocus: false,
        rolePreference: {
            jungler: ['Hayabusa', 'Julian', 'Lancelot'],
            midlane: ['Xavier', 'Valentina', 'Yve'],
            exp: ['Chou', 'Paquito', 'Esmeralda'],
            roam: ['Franco', 'Khufra', 'Mathilda'],
            gold: ['Beatrix', 'Melissa', 'Karrie']
        }
    }
};
