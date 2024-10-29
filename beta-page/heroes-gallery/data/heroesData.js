const heroesData = [
    {
        name: "Layla",
        image: "../heroes-gallery/data/hero-img/tigreal.webp",
        role: "Marksman",
        skills: [
            {
                name: "Malefic Gun",
                image: "../heroes-gallery/data/hero-img/tigreal.webp",
                description: "Increases attack range and damage"
            },
            {
                name: "Light Wheel",
                image: "../heroes-gallery/data/hero-img/tigreal.webp",
                description: "Fires a light wheel that slows enemies"
            },
            {
                name: "Destruction Rush",
                image: "../heroes-gallery/data/hero-img/tigreal.webp",
                description: "Fires a powerful energy beam"
            }
        ],
        bestItems: [
            {
                name: "Berserker's Fury",
                image: "../heroes-gallery/data/hero-img/tigreal.webp"
            },
            {
                name: "Scarlet Phantom",
                image: "../heroes-gallery/data/hero-img/tigreal.webp"
            },
            {
                name: "Endless Battle",
                image: "../heroes-gallery/data/hero-img/tigreal.webp"
            }
        ],
        counters: [
            {
                name: "Saber",
                image: "../heroes-gallery/data/hero-img/tigreal.webp"
            },
            {
                name: "Gusion",
                image: "../heroes-gallery/data/hero-img/tigreal.webp"
            }
        ]
    },
    {
        name: "Test",
        image: "../heroes-gallery/data/hero-img/tigreal.webp",
        role: "Marksman",
        skills: [
            {
                name: "Malefic Gun",
                image: "https://example.com/layla-skill1.jpg",
                description: "Increases attack range and damage"
            },
            {
                name: "Light Wheel",
                image: "https://example.com/layla-skill2.jpg",
                description: "Fires a light wheel that slows enemies"
            },
            {
                name: "Destruction Rush",
                image: "https://example.com/layla-skill3.jpg",
                description: "Fires a powerful energy beam"
            }
        ],
        bestItems: [
            {
                name: "Berserker's Fury",
                image: "https://example.com/item1.jpg"
            },
            {
                name: "Scarlet Phantom",
                image: "https://example.com/item2.jpg"
            },
            {
                name: "Endless Battle",
                image: "https://example.com/item3.jpg"
            }
        ],
        counters: [
            {
                name: "Saber",
                image: "https://example.com/saber.jpg"
            },
            {
                name: "Gusion",
                image: "https://example.com/gusion.jpg"
            }
        ]
    },
    {
        name: "Test",
        image: "../heroes-gallery/data/hero-img/tigreal.webp",
        role: "Marksman",
        skills: [
            {
                name: "Malefic Gun",
                image: "https://example.com/layla-skill1.jpg",
                description: "Increases attack range and damage"
            },
            {
                name: "Light Wheel",
                image: "https://example.com/layla-skill2.jpg",
                description: "Fires a light wheel that slows enemies"
            },
            {
                name: "Destruction Rush",
                image: "https://example.com/layla-skill3.jpg",
                description: "Fires a powerful energy beam"
            }
        ],
        bestItems: [
            {
                name: "Berserker's Fury",
                image: "https://example.com/item1.jpg"
            },
            {
                name: "Scarlet Phantom",
                image: "https://example.com/item2.jpg"
            },
            {
                name: "Endless Battle",
                image: "https://example.com/item3.jpg"
            }
        ],
        counters: [
            {
                name: "Saber",
                image: "https://example.com/saber.jpg"
            },
            {
                name: "Gusion",
                image: "https://example.com/gusion.jpg"
            }
        ]
    },
    {
        name: "Test",
        image: "../heroes-gallery/data/hero-img/tigreal.webp",
        role: "Marksman",
        skills: [
            {
                name: "Malefic Gun",
                image: "https://example.com/layla-skill1.jpg",
                description: "Increases attack range and damage"
            },
            {
                name: "Light Wheel",
                image: "https://example.com/layla-skill2.jpg",
                description: "Fires a light wheel that slows enemies"
            },
            {
                name: "Destruction Rush",
                image: "https://example.com/layla-skill3.jpg",
                description: "Fires a powerful energy beam"
            }
        ],
        bestItems: [
            {
                name: "Berserker's Fury",
                image: "https://example.com/item1.jpg"
            },
            {
                name: "Scarlet Phantom",
                image: "https://example.com/item2.jpg"
            },
            {
                name: "Endless Battle",
                image: "https://example.com/item3.jpg"
            }
        ],
        counters: [
            {
                name: "Saber",
                image: "https://example.com/saber.jpg"
            },
            {
                name: "Gusion",
                image: "https://example.com/gusion.jpg"
            }
        ]
    },
    {
        name: "Tigreal",
        image: "../heroes-gallery/data/hero-img/tigreal.webp",
        role: "Tank",
        skills: [
            {
                name: "Attack Wave",
                image: "https://example.com/tigreal-skill1.jpg",
                description: "Charges forward, dealing damage and knocking back enemies"
            },
            {
                name: "Sacred Hammer",
                image: "https://example.com/tigreal-skill2.jpg",
                description: "Sweeps his hammer, slowing and damaging enemies"
            },
            {
                name: "Implosion",
                image: "https://example.com/tigreal-skill3.jpg",
                description: "Creates a vortex that pulls enemies towards him"
            }
        ],
        bestItems: [
            {
                name: "Courage Bulwark",
                image: "https://example.com/item4.jpg"
            },
            {
                name: "Cursed Helmet",
                image: "https://example.com/item5.jpg"
            },
            {
                name: "Immortality",
                image: "https://example.com/item6.jpg"
            }
        ],
        counters: [
            {
                name: "Karrie",
                image: "https://example.com/karrie.jpg"
            },
            {
                name: "Valir",
                image: "https://example.com/valir.jpg"
            }
        ]
    },
    {
        name: "Test",
        image: "../heroes-gallery/data/hero-img/tigreal.webp",
        role: "Tank",
        skills: [
            {
                name: "Attack Wave",
                image: "https://example.com/tigreal-skill1.jpg",
                description: "Charges forward, dealing damage and knocking back enemies"
            },
            {
                name: "Sacred Hammer",
                image: "https://example.com/tigreal-skill2.jpg",
                description: "Sweeps his hammer, slowing and damaging enemies"
            },
            {
                name: "Implosion",
                image: "https://example.com/tigreal-skill3.jpg",
                description: "Creates a vortex that pulls enemies towards him"
            }
        ],
        bestItems: [
            {
                name: "Courage Bulwark",
                image: "https://example.com/item4.jpg"
            },
            {
                name: "Cursed Helmet",
                image: "https://example.com/item5.jpg"
            },
            {
                name: "Immortality",
                image: "https://example.com/item6.jpg"
            }
        ],
        counters: [
            {
                name: "Karrie",
                image: "https://example.com/karrie.jpg"
            },
            {
                name: "Valir",
                image: "https://example.com/valir.jpg"
            }
        ]
    },
    {
        name: "Test",
        image: "../heroes-gallery/data/hero-img/tigreal.webp",
        role: "Tank",
        skills: [
            {
                name: "Attack Wave",
                image: "https://example.com/tigreal-skill1.jpg",
                description: "Charges forward, dealing damage and knocking back enemies"
            },
            {
                name: "Sacred Hammer",
                image: "https://example.com/tigreal-skill2.jpg",
                description: "Sweeps his hammer, slowing and damaging enemies"
            },
            {
                name: "Implosion",
                image: "https://example.com/tigreal-skill3.jpg",
                description: "Creates a vortex that pulls enemies towards him"
            }
        ],
        bestItems: [
            {
                name: "Courage Bulwark",
                image: "https://example.com/item4.jpg"
            },
            {
                name: "Cursed Helmet",
                image: "https://example.com/item5.jpg"
            },
            {
                name: "Immortality",
                image: "https://example.com/item6.jpg"
            }
        ],
        counters: [
            {
                name: "Karrie",
                image: "https://example.com/karrie.jpg"
            },
            {
                name: "Valir",
                image: "https://example.com/valir.jpg"
            }
        ]
    },
    {
        name: "Test",
        image: "../heroes-gallery/data/hero-img/tigreal.webp",
        role: "Tank",
        skills: [
            {
                name: "Attack Wave",
                image: "https://example.com/tigreal-skill1.jpg",
                description: "Charges forward, dealing damage and knocking back enemies"
            },
            {
                name: "Sacred Hammer",
                image: "https://example.com/tigreal-skill2.jpg",
                description: "Sweeps his hammer, slowing and damaging enemies"
            },
            {
                name: "Implosion",
                image: "https://example.com/tigreal-skill3.jpg",
                description: "Creates a vortex that pulls enemies towards him"
            }
        ],
        bestItems: [
            {
                name: "Courage Bulwark",
                image: "https://example.com/item4.jpg"
            },
            {
                name: "Cursed Helmet",
                image: "https://example.com/item5.jpg"
            },
            {
                name: "Immortality",
                image: "https://example.com/item6.jpg"
            }
        ],
        counters: [
            {
                name: "Karrie",
                image: "https://example.com/karrie.jpg"
            },
            {
                name: "Valir",
                image: "https://example.com/valir.jpg"
            }
        ]
    },
    {
        name: "Chou",
        image: "../heroes-gallery/data/hero-img/tigreal.webp",
        role: "Fighter",
        skills: [
            {
                name: "Jeet Kune Do",
                image: "https://example.com/chou-skill1.jpg",
                description: "Dash and deal damage to enemies"
            },
            {
                name: "Shunpo",
                image: "https://example.com/chou-skill2.jpg",
                description: "Immune to crowd control and dash to a target location"
            },
            {
                name: "The Way of Dragon",
                image: "https://example.com/chou-skill3.jpg",
                description: "Kick an enemy, dealing damage and stunning them"
            }
        ],
        bestItems: [
            {
                name: "Blade of Despair",
                image: "https://example.com/item7.jpg"
            },
            {
                name: "Endless Battle",
                image: "https://example.com/item8.jpg"
            },
            {
                name: "Queen's Wings",
                image: "https://example.com/item9.jpg"
            }
        ],
        counters: [
            {
                name: "Kaja",
                image: "https://example.com/kaja.jpg"
            },
            {
                name: "Khufra",
                image: "https://example.com/khufra.jpg"
            }
        ]
    },
    {
        name: "Test",
        image: "../heroes-gallery/data/hero-img/tigreal.webp",
        role: "Fighter",
        skills: [
            {
                name: "Attack Wave",
                image: "https://example.com/tigreal-skill1.jpg",
                description: "Charges forward, dealing damage and knocking back enemies"
            },
            {
                name: "Sacred Hammer",
                image: "https://example.com/tigreal-skill2.jpg",
                description: "Sweeps his hammer, slowing and damaging enemies"
            },
            {
                name: "Implosion",
                image: "https://example.com/tigreal-skill3.jpg",
                description: "Creates a vortex that pulls enemies towards him"
            }
        ],
        bestItems: [
            {
                name: "Courage Bulwark",
                image: "https://example.com/item4.jpg"
            },
            {
                name: "Cursed Helmet",
                image: "https://example.com/item5.jpg"
            },
            {
                name: "Immortality",
                image: "https://example.com/item6.jpg"
            }
        ],
        counters: [
            {
                name: "Karrie",
                image: "https://example.com/karrie.jpg"
            },
            {
                name: "Valir",
                image: "https://example.com/valir.jpg"
            }
        ]
    },
    {
        name: "Test",
        image: "../heroes-gallery/data/hero-img/tigreal.webp",
        role: "Fighter",
        skills: [
            {
                name: "Attack Wave",
                image: "https://example.com/tigreal-skill1.jpg",
                description: "Charges forward, dealing damage and knocking back enemies"
            },
            {
                name: "Sacred Hammer",
                image: "https://example.com/tigreal-skill2.jpg",
                description: "Sweeps his hammer, slowing and damaging enemies"
            },
            {
                name: "Implosion",
                image: "https://example.com/tigreal-skill3.jpg",
                description: "Creates a vortex that pulls enemies towards him"
            }
        ],
        bestItems: [
            {
                name: "Courage Bulwark",
                image: "https://example.com/item4.jpg"
            },
            {
                name: "Cursed Helmet",
                image: "https://example.com/item5.jpg"
            },
            {
                name: "Immortality",
                image: "https://example.com/item6.jpg"
            }
        ],
        counters: [
            {
                name: "Karrie",
                image: "https://example.com/karrie.jpg"
            },
            {
                name: "Valir",
                image: "https://example.com/valir.jpg"
            }
        ]
    },
    {
        name: "Test",
        image: "../heroes-gallery/data/hero-img/tigreal.webp",
        role: "Fighter",
        skills: [
            {
                name: "Attack Wave",
                image: "https://example.com/tigreal-skill1.jpg",
                description: "Charges forward, dealing damage and knocking back enemies"
            },
            {
                name: "Sacred Hammer",
                image: "https://example.com/tigreal-skill2.jpg",
                description: "Sweeps his hammer, slowing and damaging enemies"
            },
            {
                name: "Implosion",
                image: "https://example.com/tigreal-skill3.jpg",
                description: "Creates a vortex that pulls enemies towards him"
            }
        ],
        bestItems: [
            {
                name: "Courage Bulwark",
                image: "https://example.com/item4.jpg"
            },
            {
                name: "Cursed Helmet",
                image: "https://example.com/item5.jpg"
            },
            {
                name: "Immortality",
                image: "https://example.com/item6.jpg"
            }
        ],
        counters: [
            {
                name: "Karrie",
                image: "https://example.com/karrie.jpg"
            },
            {
                name: "Valir",
                image: "https://example.com/valir.jpg"
            }
        ]
    },
    {
        name: "Lunox",
        image: "../heroes-gallery/data/hero-img/tigreal.webp",
        role: "Mage",
        skills: [
            {
                name: "Starlight Pulse",
                image: "https://example.com/lunox-skill1.jpg",
                description: "Fires orbs of light and darkness"
            },
            {
                name: "Cosmic Fission",
                image: "https://example.com/lunox-skill2.jpg",
                description: "Enhances abilities based on chosen aspect"
            },
            {
                name: "Dreamland Twist",
                image: "https://example.com/lunox-skill3.jpg",
                description: "Becomes invincible and deals damage"
            }
        ],
        bestItems: [
            {
                name: "Clock of Destiny",
                image: "https://example.com/item10.jpg"
            },
            {
                name: "Lightning Truncheon",
                image: "https://example.com/item11.jpg"
            },
            {
                name: "Holy Crystal",
                image: "https://example.com/item12.jpg"
            }
        ],
        counters: [
            {
                name: "Helcurt",
                image: "https://example.com/helcurt.jpg"
            },
            {
                name: "Harley",
                image: "https://example.com/harley.jpg"
            }
        ]
    }
];

export default heroesData;
