const materialUrl = (path) => `${import.meta.env.BASE_URL}${path}`

export const acceptanceExamYears = [
  {
    year: '2013-2014',
    description: 'Permbledhje provimesh pranuese per FIEK nga vitet 2013-2014.',
    document: {
      title: 'Provime pranuese per FIEK',
      fileName: '317376541-Provime-Pranuese-per-FIEK.pdf',
      url: materialUrl('materials/provime-pranuese/2013-2014/317376541-Provime-Pranuese-per-FIEK.pdf'),
      available: true,
    },
  },
  {
    year: '2015-2017',
    description: 'Disa afate te provimeve pranuese nga matematika per vitet 2015-2017.',
    document: {
      title: 'Afate provimi pranues nga matematika',
      fileName: 'afate-provim-pranues-matematika.pdf',
      url: materialUrl('materials/provime-pranuese/2015-2017/afate-provim-pranues-matematika.pdf'),
      available: true,
    },
  },
  {
    year: '2019',
    description: 'Afat i provimit pranues nga matematika per vitin 2019.',
    document: {
      title: 'Afate provimi pranues nga matematika 2019',
      fileName: 'afate-provim-pranues-matematika-2019.pdf',
      url: materialUrl('materials/provime-pranuese/2019/afate-provim-pranues-matematika-2019.pdf'),
      available: true,
    },
  },
]
