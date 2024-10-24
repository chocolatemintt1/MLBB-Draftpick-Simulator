export const roleOrder = ['Tank', 'Fighter', 'Assassin', 'Mage', 'Marksman', 'Support'];

const originalHeroes = [
    { id: "tigreal", name: "Tigreal", role: "Tank", damage: 4, durability: 9, cc: 8, image: "../assets/tigreal.png" },
    { id: "akai", name: "Akai", role: "Tank", damage: 5, durability: 8, cc: 7, image: "../assets/akai.webp" },
    { id: "franco", name: "Franco", role: "Tank", damage: 4, durability: 7, cc: 9, image: "../assets/franco.webp" },
    { id: "minotaur", name: "Minotaur", role: "Tank", damage: 5, durability: 9, cc: 8, image: "../assets/minotaur.webp" },
    { id: "minotaur", name: "Minotaur", role: "Support", damage: 5, durability: 9, cc: 8, image: "../assets/minotaur.webp" },
    { id: "lolita", name: "Lolita", role: "Tank", damage: 4, durability: 8, cc: 7, image: "../assets/lolita.webp" },
    { id: "lolita", name: "Lolita", role: "Support", damage: 4, durability: 8, cc: 7, image: "../assets/lolita.webp" },
    { id: "johnson", name: "Johnson", role: "Tank", damage: 5, durability: 9, cc: 7, image: "../assets/johnson.webp" },
    { id: "johnson", name: "Johnson", role: "Support", damage: 5, durability: 9, cc: 7, image: "../assets/johnson.webp" },
    { id: "grock", name: "Grock", role: "Tank", damage: 6, durability: 8, cc: 6, image: "../assets/grock.webp" },
    { id: "grock", name: "Grock", role: "Fighter", damage: 6, durability: 8, cc: 6, image: "../assets/grock.webp" },
    { id: "hylos", name: "Hylos", role: "Tank", damage: 5, durability: 9, cc: 6, image: "../assets/hylos.webp" },
    { id: "uranus", name: "Uranus", role: "Tank", damage: 4, durability: 9, cc: 4, image: "../assets/uranus.webp" },
    { id: "belerick", name: "Belerick", role: "Tank", damage: 4, durability: 9, cc: 6, image: "../assets/belerick.webp" },
    { id: "khufra", name: "Khufra", role: "Tank", damage: 5, durability: 8, cc: 9, image: "../assets/khufra.webp" },
    { id: "baxia", name: "Baxia", role: "Tank", damage: 5, durability: 8, cc: 7, image: "../assets/baxia.webp" },
    { id: "atlas", name: "Atlas", role: "Tank", damage: 4, durability: 8, cc: 9, image: "../assets/atlas.webp" },
    { id: "barats", name: "Barats", role: "Tank", damage: 6, durability: 8, cc: 7, image: "../assets/barats.webp" },
    { id: "barats", name: "Barats", role: "Fighter", damage: 6, durability: 8, cc: 7, image: "../assets/barats.webp" },
    { id: "gloo", name: "Gloo", role: "Tank", damage: 5, durability: 9, cc: 7, image: "../assets/gloo.webp" },
    { id: "edith", name: "Edith", role: "Tank", damage: 6, durability: 8, cc: 7, image: "../assets/edith.webp" },
    { id: "edith", name: "Edith", role: "Marksman", damage: 6, durability: 8, cc: 7, image: "../assets/edith.webp" },
    { id: "fredrinn", name: "Fredrinn", role: "Tank", damage: 6, durability: 8, cc: 6, image: "../assets/fredrinn.webp" },
    { id: "fredrinn", name: "Fredrinn", role: "Fighter", damage: 6, durability: 8, cc: 6, image: "../assets/fredrinn.webp" },



    { id: "alucard", name: "Alucard", role: "Fighter", damage: 8, durability: 5, cc: 3, image: "../assets/alucard.webp" },
    { id: "alucard", name: "Alucard", role: "Assassin", damage: 8, durability: 5, cc: 3, image: "../assets/alucard.webp" },
    { id: "bane", name: "Bane", role: "Fighter", damage: 7, durability: 6, cc: 5, image: "../assets/bane.webp" },
    { id: "bane", name: "Bane", role: "Mage", damage: 7, durability: 6, cc: 5, image: "../assets/bane.webp" },
    { id: "zilong", name: "Zilong", role: "Fighter", damage: 8, durability: 5, cc: 4, image: "../assets/zilong.webp" },
    { id: "zilong", name: "Zilong", role: "Assassin", damage: 8, durability: 5, cc: 4, image: "../assets/zilong.webp" },
    { id: "freya", name: "Freya", role: "Fighter", damage: 7, durability: 6, cc: 5, image: "../assets/freya.webp" },
    { id: "chou", name: "Chou", role: "Fighter", damage: 7, durability: 6, cc: 7, image: "../assets/chou.webp" },
    { id: "sun", name: "Sun", role: "Fighter", damage: 7, durability: 6, cc: 4, image: "../assets/sun.webp" },
    { id: "alpha", name: "Alpha", role: "Fighter", damage: 7, durability: 6, cc: 5, image: "../assets/alpha.webp" },
    { id: "ruby", name: "Ruby", role: "Fighter", damage: 6, durability: 7, cc: 8, image: "../assets/ruby.webp" },
    { id: "lapu-lapu", name: "Lapu-Lapu", role: "Fighter", damage: 8, durability: 6, cc: 6, image: "../assets/lapu-lapu.webp" },
    { id: "gatot kaca", name: "Gatot Kaca", role: "Fighter", damage: 5, durability: 8, cc: 8, image: "../assets/gatotkaca.webp" },
    { id: "gatot kaca", name: "Gatot Kaca", role: "Tank", damage: 5, durability: 8, cc: 8, image: "../assets/gatotkaca.webp" },
    { id: "argus", name: "Argus", role: "Fighter", damage: 8, durability: 5, cc: 4, image: "../assets/argus.webp" },
    { id: "martis", name: "Martis", role: "Fighter", damage: 7, durability: 6, cc: 6, image: "../assets/martis.webp" },
    { id: "kaja", name: "Kaja", role: "Fighter", damage: 6, durability: 6, cc: 8, image: "../assets/kaja.webp" },
    { id: "kaja", name: "Kaja", role: "Support", damage: 6, durability: 6, cc: 8, image: "../assets/kaja.webp" },
    { id: "aldous", name: "Aldous", role: "Fighter", damage: 9, durability: 6, cc: 5, image: "../assets/aldous.webp" },
    { id: "leomord", name: "Leomord", role: "Fighter", damage: 8, durability: 6, cc: 5, image: "../assets/leomord.webp" },
    { id: "thamuz", name: "Thamuz", role: "Fighter", damage: 7, durability: 7, cc: 5, image: "../assets/thamuz.webp" },
    { id: "minsitthar", name: "Minsitthar", role: "Fighter", damage: 6, durability: 7, cc: 7, image: "../assets/minsitthar.webp" },
    { id: "badang", name: "Badang", role: "Fighter", damage: 7, durability: 6, cc: 7, image: "../assets/badang.webp" },
    { id: "guinevere", name: "Guinevere", role: "Fighter", damage: 8, durability: 5, cc: 7, image: "../assets/guinevere.webp" },
    { id: "terizla", name: "Terizla", role: "Fighter", damage: 7, durability: 7, cc: 7, image: "../assets/terizla.webp" },
    { id: "terizla", name: "Terizla", role: "Tank", damage: 7, durability: 7, cc: 7, image: "../assets/terizla.webp" },
    { id: "x.borg", name: "X.Borg", role: "Fighter", damage: 8, durability: 6, cc: 5, image: "../assets/xborg.webp" },
    { id: "dyrroth", name: "Dyrroth", role: "Fighter", damage: 8, durability: 5, cc: 4, image: "../assets/dyrroth.webp" },
    { id: "silvanna", name: "Silvanna", role: "Fighter", damage: 7, durability: 6, cc: 7, image: "../assets/silvanna.webp" },
    { id: "yu zhong", name: "Yu Zhong", role: "Fighter", damage: 7, durability: 7, cc: 6, image: "../assets/yuzhong.webp" },
    { id: "khaleed", name: "Khaleed", role: "Fighter", damage: 7, durability: 6, cc: 6, image: "../assets/khaleed.webp" },
    { id: "paquito", name: "Paquito", role: "Fighter", damage: 8, durability: 6, cc: 6, image: "../assets/paquito.webp" },
    { id: "paquito", name: "Paquito", role: "Assassin", damage: 8, durability: 6, cc: 6, image: "../assets/paquito.webp" },
    { id: "yin", name: "Yin", role: "Fighter", damage: 8, durability: 5, cc: 6, image: "../assets/yin.webp" },
    { id: "yin", name: "Yin", role: "Assassin", damage: 8, durability: 5, cc: 6, image: "../assets/yin.webp" },
    { id: "julian", name: "Julian", role: "Fighter", damage: 8, durability: 6, cc: 7, image: "../assets/julian.webp" },
    { id: "julian", name: "Julian", role: "Mage", damage: 8, durability: 6, cc: 7, image: "../assets/julian.webp" },
    { id: "hilda", name: "Hilda", role: "Fighter", damage: 4, durability: 9, cc: 4, image: "../assets/hilda.webp" },
    { id: "hilda", name: "Hilda", role: "Tank", damage: 4, durability: 9, cc: 4, image: "../assets/hilda.webp" },
    { id: "masha", name: "Masha", role: "Tank", damage: 7, durability: 5, cc: 3, image: "../assets/masha.webp" },
    { id: "masha", name: "Masha", role: "Fighter", damage: 7, durability: 5, cc: 3, image: "../assets/masha.webp" },
    { id: "roger", name: "Roger", role: "Fighter", damage: 4, durability: 6, cc: 1, image: "../assets/roger.webp" },
    { id: "roger", name: "Roger", role: "Marksman", damage: 4, durability: 6, cc: 1, image: "../assets/roger.webp" },
    { id: "cici", name: "Cici", role: "Fighter", damage: 6, durability: 5, cc: 2, image: "../assets/cici.webp" },
    { id: "arlott", name: "Arlott", role: "Fighter", damage: 6, durability: 6, cc: 5, image: "../assets/arlott.webp" },
    { id: "arlott", name: "Arlott", role: "Assassin", damage: 6, durability: 6, cc: 5, image: "../assets/arlott.webp" },
    { id: "jawhead", name: "Jawhead", role: "Fighter", damage: 3, durability: 6, cc: 6, image: "../assets/jawhead.webp" },
    { id: "phoveus", name: "Phoveus", role: "Fighter", damage: 7, durability: 8, cc: 3, image: "../assets/phoveus.webp" },
    { id: "aulus", name: "Aulus", role: "Fighter", damage: 6, durability: 6, cc: 1, image: "../assets/aulus.webp" },


    { id: "joy", name: "Joy", role: "Assassin", damage: 7, durability: 6, cc: 5, image: "../assets/joy.webp" },
    { id: "saber", name: "Saber", role: "Assassin", damage: 8, durability: 3, cc: 4, image: "../assets/saber.webp" },
    { id: "karina", name: "Karina", role: "Assassin", damage: 9, durability: 3, cc: 3, image: "../assets/karina.webp" },
    { id: "fanny", name: "Fanny", role: "Assassin", damage: 9, durability: 3, cc: 4, image: "../assets/fanny.webp" },
    { id: "hayabusa", name: "Hayabusa", role: "Assassin", damage: 9, durability: 3, cc: 3, image: "../assets/hayabusa.webp" },
    { id: "natalia", name: "Natalia", role: "Assassin", damage: 8, durability: 3, cc: 4, image: "../assets/natalia.webp" },
    { id: "lancelot", name: "Lancelot", role: "Assassin", damage: 9, durability: 3, cc: 3, image: "../assets/lancelot.webp" },
    { id: "gusion", name: "Gusion", role: "Assassin", damage: 9, durability: 3, cc: 3, image: "../assets/gusion.webp" },
    { id: "helcurt", name: "Helcurt", role: "Assassin", damage: 8, durability: 3, cc: 5, image: "../assets/helcurt.webp" },
    { id: "selena", name: "Selena", role: "Assassin", damage: 8, durability: 3, cc: 7, image: "../assets/selena.webp" },
    { id: "hanzo", name: "Hanzo", role: "Assassin", damage: 8, durability: 3, cc: 4, image: "../assets/hanzo.webp" },
    { id: "kadita", name: "Kadita", role: "Assassin", damage: 8, durability: 4, cc: 6, image: "../assets/kadita.webp" },
    { id: "kadita", name: "Kadita", role: "Mage", damage: 8, durability: 4, cc: 6, image: "../assets/kadita.webp" },
    { id: "ling", name: "Ling", role: "Assassin", damage: 9, durability: 3, cc: 4, image: "../assets/ling.webp" },
    { id: "benedetta", name: "Benedetta", role: "Assassin", damage: 8, durability: 4, cc: 4, image: "../assets/benedetta.webp" },
    { id: "benedetta", name: "Benedetta", role: "Fighter", damage: 8, durability: 4, cc: 4, image: "../assets/benedetta.webp" },
    { id: "mathilda", name: "Mathilda", role: "Assassin", damage: 2, durability: 8, cc: 4, image: "../assets/mathilda.webp" },
    { id: "aamon", name: "Aamon", role: "Assassin", damage: 9, durability: 3, cc: 3, image: "../assets/aamon.webp" },
    { id: "suyou", name: "Suyou", role: "Assassin", damage: 6, durability: 6, cc: 5, image: "../assets/suyou.webp" },
    { id: "suyou", name: "Suyou", role: "Fighter", damage: 6, durability: 6, cc: 5, image: "../assets/suyou.webp" },
    { id: "nolan", name: "Nolan", role: "Assassin", damage: 6, durability: 3, cc: 2, image: "../assets/nolan.webp" },


    { id: "floryn", name: "Floryn", role: "Support", damage: 5, durability: 4, cc: 6, image: "../assets/floryn.webp" },
    { id: "angela", name: "Angela", role: "Support", damage: 2, durability: 3, cc: 5, image: "../assets/angela.webp" },
    { id: "diggie", name: "Diggie", role: "Support", damage: 4, durability: 4, cc: 2, image: "../assets/diggie.webp" },
    { id: "estes", name: "Estes", role: "Support", damage: 1, durability: 7, cc: 2, image: "../assets/estes.webp" },
    { id: "rafaela", name: "Rafaela", role: "Support", damage: 2, durability: 6, cc: 7, image: "../assets/rafaela.webp" },
    { id: "mathilda", name: "Mathilda", role: "Support", damage: 2, durability: 8, cc: 4, image: "../assets/mathilda.webp" },
    { id: "faramis", name: "Faramis", role: "Support", damage: 6, durability: 4, cc: 1, image: "../assets/faramis.webp" },
    { id: "faramis", name: "Faramis", role: "Mage", damage: 6, durability: 4, cc: 1, image: "../assets/faramis.webp" },
    { id: "chip", name: "Chip", role: "Support", damage: 2, durability: 8, cc: 6, image: "../assets/chip.webp" },
    { id: "chip", name: "Chip", role: "Tank", damage: 2, durability: 8, cc: 6, image: "../assets/chip.webp" },
    { id: "carmilla", name: "Carmilla", role: "Support", damage: 2, durability: 9, cc: 8, image: "../assets/carmilla.webp" },
    { id: "carmilla", name: "Carmilla", role: "Tank", damage: 2, durability: 9, cc: 8, image: "../assets/carmilla.webp" },


    { id: "nana", name: "Nana", role: "Mage", damage: 8, durability: 3, cc: 7, image: "../assets/nana.webp" },
    { id: "eudora", name: "Eudora", role: "Mage", damage: 9, durability: 2, cc: 6, image: "../assets/eudora.webp" },
    { id: "alice", name: "Alice", role: "Tank", damage: 7, durability: 6, cc: 6, image: "../assets/alice.webp" },
    { id: "alice", name: "Alice", role: "Mage", damage: 7, durability: 6, cc: 6, image: "../assets/alice.webp" },
    { id: "gord", name: "Gord", role: "Mage", damage: 9, durability: 2, cc: 5, image: "../assets/gord.webp" },
    { id: "kagura", name: "Kagura", role: "Mage", damage: 9, durability: 3, cc: 6, image: "../assets/kagura.webp" },
    { id: "cyclops", name: "Cyclops", role: "Mage", damage: 8, durability: 3, cc: 5, image: "../assets/cyclops.webp" },
    { id: "aurora", name: "Aurora", role: "Mage", damage: 8, durability: 3, cc: 8, image: "../assets/aurora.webp" },
    { id: "vexana", name: "Vexana", role: "Mage", damage: 8, durability: 3, cc: 6, image: "../assets/vexana.webp" },
    { id: "harley", name: "Harley", role: "Assassin", damage: 9, durability: 2, cc: 3, image: "../assets/harley.webp" },
    { id: "harley", name: "Harley", role: "Mage", damage: 9, durability: 2, cc: 3, image: "../assets/harley.webp" },
    { id: "odette", name: "Odette", role: "Mage", damage: 9, durability: 2, cc: 6, image: "../assets/odette.webp" },
    { id: "pharsa", name: "Pharsa", role: "Mage", damage: 9, durability: 2, cc: 5, image: "../assets/pharsa.webp" },
    { id: "zhask", name: "Zhask", role: "Mage", damage: 9, durability: 3, cc: 5, image: "../assets/zhask.webp" },
    { id: "valir", name: "Valir", role: "Mage", damage: 8, durability: 3, cc: 7, image: "../assets/valir.webp" },
    { id: "chang'e", name: "Chang'e", role: "Mage", damage: 9, durability: 2, cc: 4, image: "../assets/change.webp" },
    { id: "lunox", name: "Lunox", role: "Mage", damage: 9, durability: 3, cc: 4, image: "../assets/lunox.webp" },
    { id: "harith", name: "Harith", role: "Mage", damage: 8, durability: 3, cc: 5, image: "../assets/harith.webp" },
    { id: "kimmy", name: "Kimmy", role: "Marksman", damage: 9, durability: 2, cc: 3, image: "../assets/kimmy.webp" },
    { id: "kimmy", name: "Kimmy", role: "Mage", damage: 9, durability: 2, cc: 3, image: "../assets/kimmy.webp" },
    { id: "esmeralda", name: "Esmeralda", role: "Tank", damage: 7, durability: 6, cc: 4, image: "../assets/esmeralda.webp" },
    { id: "esmeralda", name: "Esmeralda", role: "Mage", damage: 7, durability: 6, cc: 4, image: "../assets/esmeralda.webp" },
    { id: "lylia", name: "Lylia", role: "Mage", damage: 9, durability: 2, cc: 5, image: "../assets/lylia.webp" },
    { id: "cecilion", name: "Cecilion", role: "Mage", damage: 9, durability: 2, cc: 5, image: "../assets/cecilion.webp" },
    { id: "lou yi", name: "Lou Yi", role: "Mage", damage: 8, durability: 3, cc: 6, image: "../assets/louyi.webp" },
    { id: "yve", name: "Yve", role: "Mage", damage: 8, durability: 2, cc: 7, image: "../assets/yve.webp" },
    { id: "valentina", name: "Valentina", role: "Mage", damage: 8, durability: 4, cc: 6, image: "../assets/valentina.webp" },
    { id: "xavier", name: "Xavier", role: "Mage", damage: 9, durability: 2, cc: 5, image: "../assets/xavier.webp" },
    { id: "novaria", name: "Novaria", role: "Mage", damage: 9, durability: 3, cc: 3, image: "../assets/novaria.webp" },
    { id: "zhuxin", name: "Zhuxin", role: "Mage", damage: 7, durability: 4, cc: 9, image: "../assets/zhuxin.webp" },
    { id: "vale", name: "Vale", role: "Mage", damage: 1, durability: 2, cc: 7, image: "../assets/vale.webp" },



    { id: "miya", name: "Miya", role: "Marksman", damage: 8, durability: 2, cc: 3, image: "../assets/miya.webp" },
    { id: "bruno", name: "Bruno", role: "Marksman", damage: 9, durability: 2, cc: 3, image: "../assets/bruno.webp" },
    { id: "clint", name: "Clint", role: "Marksman", damage: 8, durability: 3, cc: 4, image: "../assets/clint.webp" },
    { id: "layla", name: "Layla", role: "Marksman", damage: 9, durability: 1, cc: 2, image: "../assets/layla.webp" },
    { id: "yi-sun-shin", name: "Yi Sun-shin", role: "Assassin", damage: 8, durability: 3, cc: 4, image: "../assets/yss.webp" },
    { id: "yi-sun-shin", name: "Yi Sun-shin", role: "Marksman", damage: 8, durability: 3, cc: 4, image: "../assets/yss.webp" },
    { id: "moskov", name: "Moskov", role: "Marksman", damage: 9, durability: 2, cc: 4, image: "../assets/moskov.webp" },
    { id: "karrie", name: "Karrie", role: "Marksman", damage: 8, durability: 3, cc: 3, image: "../assets/karrie.webp" },
    { id: "irithel", name: "Irithel", role: "Marksman", damage: 9, durability: 2, cc: 3, image: "../assets/irithel.webp" },
    { id: "lesley", name: "Lesley", role: "Assassin", damage: 9, durability: 2, cc: 2, image: "../assets/lesley.webp" },
    { id: "lesley", name: "Lesley", role: "Marksman", damage: 9, durability: 2, cc: 2, image: "../assets/lesley.webp" },
    { id: "hanabi", name: "Hanabi", role: "Marksman", damage: 8, durability: 3, cc: 4, image: "../assets/hanabi.webp" },
    { id: "claude", name: "Claude", role: "Marksman", damage: 9, durability: 2, cc: 3, image: "../assets/claude.webp" },
    { id: "granger", name: "Granger", role: "Marksman", damage: 9, durability: 2, cc: 3, image: "../assets/granger.webp" },
    { id: "wanwan", name: "Wanwan", role: "Marksman", damage: 8, durability: 2, cc: 4, image: "../assets/wanwan.webp" },
    { id: "popol and kupa", name: "Popol and Kupa", role: "Marksman", damage: 8, durability: 3, cc: 5, image: "../assets/popolkupa.webp" },
    { id: "brody", name: "Brody", role: "Marksman", damage: 7, durability: 4, cc: 5, image: "../assets/brody.webp" },
    { id: "ixia", name: "Ixia", role: "Marksman", damage: 7, durability: 3, cc: 5, image: "../assets/ixia.webp" },
    { id: "melissa", name: "Melissa", role: "Marksman", damage: 9, durability: 2, cc: 4, image: "../assets/melissa.webp" },
    { id: "beatrix", name: "Beatrix", role: "Marksman", damage: 8, durability: 3, cc: 1, image: "../assets/beatrix.webp" },
    { id: "natan", name: "Natan", role: "Marksman", damage: 6, durability: 2, cc: 2, image: "../assets/natan.webp" },


    /*easter eggs*/
    { id: "kanade", name: "Kanade", role: "Fighter", damage: 10, durability: 10, cc: 10, image: "../assets/kanade.webp" },
    { id: "shinazugawa", name: "Sanemi", role: "Fighter", damage: 1, durability: 1, cc: 1, image: "../assets/shinazugawa.png" },
    { id: "obanai", name: "Obanai", role: "Fighter", damage: 1, durability: 1, cc: 1, image: "../assets/obanai.jpg" },
    { id: "carlo", name: "GOD", role: "Fighter", damage: 99, durability: 99, cc: 99, image: "https://chocolatemintt1.github.io/carloamparo22/pfp_img.jpg" }
];

const getHeroRoles = (hero) => {
    return roleOrder.filter(role => hero.role.includes(role));
};

const expandedHeroes = originalHeroes.flatMap(hero => {
    const roles = getHeroRoles(hero);
    return roles.map(role => ({...hero, role}));
});


const heroesByRole = roleOrder.reduce((acc, role) => {
    acc[role] = expandedHeroes.filter(hero => hero.role === role);
    return acc;
}, {});

// Flatten the grouped heroes back into an array, maintaining the role order
export const heroes = roleOrder.flatMap(role => heroesByRole[role]);

// Export the original heroes array as well, in case it's needed elsewhere
export const allHeroes = originalHeroes;