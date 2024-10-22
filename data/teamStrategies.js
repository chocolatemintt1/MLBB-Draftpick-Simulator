export const teamStrategies = {
    blacklist: {
        name: 'Blacklist International',
        preferredPicks: ['Estes', 'Mathilda', 'Beatrix', 'Valentina', 'Khufra', 'Lancelot', 'Paquito', 'Esmeralda', 'Julian', 'Kagura'],
        commonBans: ['Fanny', 'Ling', 'Hayabusa', 'Suyou', 'Alpha'],
        playstyle: 'defensive',
        lateGameFocus: true,
        rolePreference: {
            jungler: ['Alpha', 'Suyou', 'Ling'],
            midlane: ['Valentina', 'Aurora', 'Yve'],
            exp: ['Hylos', 'Khaleed', 'Terizla'],
            roam: ['Mathilda', 'Rafaela', 'Chou'],
            gold: ['Harith', 'Karrie', 'Moskov']
        }
    },
    echo: {
        name: 'Team Liquid Echo Philippines',
        preferredPicks: ['Fanny', 'Chou', 'Ling', 'Lolita', 'Beatrix', 'Xavier', 'Lylia', 'Khufra', 'Yve', 'Karrie'],
        commonBans: ['Gatot Kaca', 'Hylos', 'Hayabusa', 'Suyou', 'Alpha'],
        playstyle: 'aggressive',
        lateGameFocus: false,
        rolePreference: {
            jungler: ['Alpha', 'Ling', 'Suyou'],
            midlane: ['Valentina', 'Aurora', 'Yve', 'Vexana'],
            exp: ['Phoveus', 'Hylos', 'Arlott'],
            roam: ['Chou', 'Khufra', 'Edith'],
            gold: ['Claude', 'Karrie', 'Harith']
        }
    },
    onic: {
        name: 'Fanatic ONIC Philippines',
        preferredPicks: ['Hayabusa', 'Julian', 'Atlas', 'Yve', 'Melissa', 'Valentina', 'Esmeralda', 'Beatrix', 'Khufra', 'Chou'],
        commonBans: ['Julian', 'Harith', 'Claude', 'Hylos', 'Phoveus'],
        playstyle: 'aggressive',
        lateGameFocus: false,
        rolePreference: {
            jungler: ['Nolan', 'Julian', 'Alpha'],
            midlane: ['Yve', 'Valentina', 'Lou Yi'],
            exp: ['Chou', 'Gatot Kaca', 'Hylos'],
            roam: ['Hylos', 'Chou', 'Mathilda'],
            gold: ['Harith', 'Beatrix', 'Karrie', 'Claude']
        }
    },
    ap: {
        name: 'Falcons AP Bren',
        preferredPicks: ['Ling', 'Beatrix', 'Mathilda', 'Valentina', 'Esmeralda', 'Lolita', 'Julian', 'Aamon', 'Karrie', 'Atlas'],
        commonBans: ['Fanny', 'Ling', 'Gatot Kaca', 'Harith', 'Mathilda'],
        playstyle: 'aggressive',
        lateGameFocus: true,
        rolePreference: {
            jungler: ['Ling', 'Fanny', 'Alpha'],
            midlane: ['Valentina', 'Julian', 'Lylia', 'Faramis', 'Aurora', 'Vexana'],
            exp: ['Khaleed', 'Gatot Kaca', 'Phoveus'],
            roam: ['Mathilda', 'Arlott', 'Minotaur', 'Tigreal'],
            gold: ['Harith', 'Beatrix', 'Karrie', 'Claude']
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
        commonBans: ['Ling', 'Fanny', 'Faramis', 'Suyou', 'Valentina'],
        playstyle: 'aggressive',
        lateGameFocus: true,
        rolePreference: {
            jungler: ['Ling', 'Fanny', 'Alpha', 'Suyou'],
            midlane: ['Valentina', 'Julian', 'Lylia', 'Faramis', 'Aurora', 'Vexana'],
            exp: ['Khaleed', 'Gatot Kaca', 'Phoveus'],
            roam: ['Mathilda', 'Arlott', 'Minotaur', 'Tigreal'],
            gold: ['Harith', 'Beatrix', 'Karrie', 'Claude']
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
