const materialUrl = (path) => `${import.meta.env.BASE_URL}${path}`

export const acceptanceExamYears = [
  {
    year: '2019',
    description: 'Disa afate te provimeve pranuese nga matematika per vitin 2019.',
    files: [
      {
        label: '1',
        title: 'Afate provimi pranues nga matematika 2019',
        fileName: 'afate-provim-pranues-matematika-2019.pdf',
        url: materialUrl('materials/provime-pranuese/2019/afate-provim-pranues-matematika-2019.pdf'),
        available: true,
      },
      {
        label: '1.1',
        title: 'Afate provimi pranues nga matematika 2019 - 1',
        fileName: 'afate-provim-pranues-matematika-2019-1.pdf',
        url: materialUrl('materials/provime-pranuese/2019/afate-provim-pranues-matematika-2019-1.pdf'),
        available: true,
      },
      {
        label: '2',
        title: 'Afate provimi pranues nga matematika 2019 - 2',
        fileName: 'afate-provim-pranues-matematika-2019-2.pdf',
        url: materialUrl('materials/provime-pranuese/2019/afate-provim-pranues-matematika-2019-2.pdf'),
        available: true,
      },
      {
        label: '2.1',
        title: 'Afate provimi pranues nga matematika 2019 - 2.1',
        fileName: 'afate-provim-pranues-matematika-2019-2-1.pdf',
        url: materialUrl('materials/provime-pranuese/2019/afate-provim-pranues-matematika-2019-2-1.pdf'),
        available: true,
      },
      {
        label: '3',
        title: 'Afate provimi pranues nga matematika 2019 - 3',
        fileName: 'afate-provim-pranues-matematika-2019-3.pdf',
        url: materialUrl('materials/provime-pranuese/2019/afate-provim-pranues-matematika-2019-3.pdf'),
        available: true,
      },
    ],
  },
  {
    year: '2015',
    description: 'Disa afate te provimeve pranuese nga matematika per vitin 2015.',
    files: [
      {
        label: '1',
        title: 'Disa afate te provimeve pranuese nga matematika',
        fileName: 'afate-provim-pranues-matematika.pdf',
        url: materialUrl('materials/provime-pranuese/2015/afate-provim-pranues-matematika.pdf'),
        available: true,
      },
    ],
  },
]
