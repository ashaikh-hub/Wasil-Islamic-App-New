// Reciters shown in the app. `image` is null where the photo has not been added to the repo yet.
const reciters = [
  {
    id: 7,
    reciter_id: 7,
    name: "Mishari Rashid al-`Afasy",
    image: require('./image-7.png'),
    translated_name: {
      name: "Mishari Rashid al-`Afasy",
      language_name: "english",
    },
    style: {
      name: "Murattal",
      language_name: "english",
      description:
        "Murattal is Quranic recitation at a slower pace, used for study and practice.",
    },
    qirat: {
      name: "Hafs",
      language_name: "english",
    },
  },
  {
    id: 3,
    reciter_id: 3,
    name: "Abdur-Rahman as-Sudais",
    image: require('./image-3.png'),
    translated_name: {
      name: "Abdur-Rahman as-Sudais",
      language_name: "english",
    },
    style: {
      name: "Murattal",
      language_name: "english",
      description:
        "Murattal is Quranic recitation at a slower pace, used for study and practice.",
    },
    qirat: {
      name: "Hafs",
      language_name: "english",
    },
  },
  {
    id: 1,
    reciter_id: 1,
    name: "Abdul Baset Abdul Samad",
    image: null, // photo not in the repo yet; an initials avatar is shown
    translated_name: {
      name: "Abdul Baset Abdul Samad",
      language_name: "english",
    },
    style: {
      name: "Mujawwad",
      language_name: "english",
      description:
        "Mujawwad is a melodic style of Holy Quran recitation.",
    },
    qirat: {
      name: "Hafs",
      language_name: "english",
    },
  },
  {
    id: 10,
    reciter_id: 10,
    name: "Sa'ud ash-Shuraim",
    image: require('./image-10.png'),
    translated_name: {
      name: "Sa`ud ash-Shuraym",
      language_name: "english",
    },
    style: {
      name: "Murattal",
      language_name: "english",
      description:
        "Murattal is Quranic recitation at a slower pace, used for study and practice.",
    },
    qirat: {
      name: "Hafs",
      language_name: "english",
    },
  },
  {
    id: 161,
    reciter_id: 161,
    name: "Khalifah Al Tunaiji",
    image: require('./recitersjpg/image-161.png'),
    translated_name: {
      name: "Khalifah Taniji",
      language_name: "english",
    },
    style: {
      name: "Murattal",
      language_name: "english",
      description:
        "Murattal is Quranic recitation at a slower pace, used for study and practice.",
    },
    qirat: {
      name: "Hafs",
      language_name: "english",
    },
  },
  {
    id: 6,
    reciter_id: 6,
    name: "Mahmoud Khalil Al-Husary",
    image: null, // photo not in the repo yet; an initials avatar is shown
    translated_name: {
      name: "Mahmoud Khalil Al-Husary",
      language_name: "english",
    },
    style: {
      name: "Murattal",
      language_name: "english",
      description:
        "Murattal is Quranic recitation at a slower pace, used for study and practice.",
    },
    qirat: {
      name: "Hafs",
      language_name: "english",
    },
  },
  {
    id: 2,
    reciter_id: 2,
    name: "Abdul Baset Abdul Samad",
    image: null, // photo not in the repo yet; an initials avatar is shown
    translated_name: {
      name: "Abdul Baset Abdul Samad",
      language_name: "english",
    },
    style: {
      name: "Murattal",
      language_name: "english",
      description:
        "Murattal is Quranic recitation at a slower pace, used for study and practice.",
    },
    qirat: {
      name: "Hafs",
      language_name: "english",
    },
  },
  {
    id: 4,
    reciter_id: 4,
    name: "Abu Bakr al-Shatri",
    image: require('./image-4.png'),
    translated_name: {
      name: "Abu Bakr al-Shatri",
      language_name: "english",
    },
    style: {
      name: "Murattal",
      language_name: "english",
      description:
        "Murattal is Quranic recitation at a slower pace, used for study and practice.",
    },
    qirat: {
      name: "Hafs",
      language_name: "english",
    },
  },
  {
    id: 9,
    reciter_id: 9,
    name: "Mohamed Siddiq al-Minshawi",
    image: null, // photo not in the repo yet; an initials avatar is shown
    translated_name: {
      name: "Mohamed Siddiq al-Minshawi",
      language_name: "english",
    },
    style: {
      name: "Murattal",
      language_name: "english",
      description:
        "Murattal is Quranic recitation at a slower pace, used for study and practice.",
    },
    qirat: {
      name: "Hafs",
      language_name: "english",
    },
  },
  {
    id: 5,
    reciter_id: 5,
    name: "Hani ar-Rifai",
    image: require('./image-5.png'),
    translated_name: {
      name: "Hani ar-Rifai",
      language_name: "english",
    },
    style: {
      name: "Murattal",
      language_name: "english",
      description:
        "Murattal is Quranic recitation at a slower pace, used for study and practice.",
    },
    qirat: {
      name: "Hafs",
      language_name: "english",
    },
  },
  {
    id: 12,
    reciter_id: 12,
    name: "Mahmoud Khalil Al-Husary",
    image: null, // photo not in the repo yet; an initials avatar is shown
    translated_name: {
      name: "Mahmoud Khalil Al-Husary",
      language_name: "english",
    },
    style: {
      name: "Muallim",
      language_name: "english",
      description:
        "Muallim is a teaching style recitation of the Holy Quran.",
    },
    qirat: {
      name: "Hafs",
      language_name: "english",
    },
  },
  {
    id: 173,
    reciter_id: 173,
    name: "Mishari Rashid al-`Afasy",
    image: require('./image-7.png'),
    translated_name: {
      name: "Mishari Rashid al-`Afasy",
      language_name: "english",
    },
    style: {
      name: "Murattal - Streaming",
      language_name: "english",
      description:
        "Murattal is Quranic recitation at a slower pace, used for study and practice.",
    },
    qirat: {
      name: "Hafs",
      language_name: "english",
    },
  },
  {
    id: 168,
    reciter_id: 168,
    name: "Mohamed Siddiq al-Minshawi",
    image: null, // photo not in the repo yet; an initials avatar is shown
    translated_name: {
      name: "Mohamed Siddiq al-Minshawi",
      language_name: "english",
    },
    style: {
      name: "Kids repeat",
      language_name: "english",
      description: "Kids repeat after the qari",
    },
    qirat: {
      name: "Hafs",
      language_name: "english",
    },
  },
];

export default reciters;
