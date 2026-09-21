import { UnifiedMediaItem, UnifiedMediaDetail, PersonDetail, TVSeasonDetail } from '../types/api';

export const MOCK_MEDIA_ITEMS: UnifiedMediaDetail[] = [
  // 1. Inception
  {
    id: 27205,
    mediaType: 'movie',
    title: 'Inception',
    originalTitle: 'Inception',
    overview: 'Cobb, a skilled thief who commits corporate espionage by infiltrating the subconscious of his targets is offered a chance to regain his old life as payment for a task considered to be impossible: "inception", the implantation of another person\'s idea into a target\'s subconscious.',
    posterPath: '/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg',
    backdropPath: '/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg',
    releaseDate: '2010-07-15',
    releaseYear: 2010,
    voteAverage: 8.4,
    voteCount: 35000,
    genreIds: [28, 878, 12],
    genreNames: ['Action', 'Sci-Fi', 'Adventure'],
    originalLanguage: 'en',
    popularity: 98.5,
    adult: false,
    tagline: 'Your mind is the scene of the crime.',
    status: 'Released',
    runtime: 148,
    budget: 160000000,
    revenue: 836836967,
    credits: {
      cast: [
        { id: 6193, name: 'Leonardo DiCaprio', character: 'Dom Cobb', profilePath: '/wo2Configuration.jpg', order: 0 },
        { id: 24045, name: 'Joseph Gordon-Levitt', character: 'Arthur', profilePath: '/4GQ4TKnT9sN.jpg', order: 1 },
        { id: 27578, name: 'Elliot Page', character: 'Ariadne', profilePath: '/eZ1N8P1.jpg', order: 2 },
        { id: 2524, name: 'Tom Hardy', character: 'Eames', profilePath: '/yVGF93.jpg', order: 3 }
      ],
      crew: [{ id: 525, name: 'Christopher Nolan', job: 'Director', department: 'Directing', profilePath: '/xuB7b.jpg' }],
      directors: [{ id: 525, name: 'Christopher Nolan', job: 'Director', department: 'Directing', profilePath: '/xuB7b.jpg' }]
    },
    trailers: [{ id: '1', key: 'YoHD9XEInc0', name: 'Official Trailer', type: 'Trailer' }],
    watchProviders: {
      country: 'US',
      flatrate: [{ providerId: 8, providerName: 'Netflix', logoPath: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' }],
      rent: [{ providerId: 2, providerName: 'Apple TV', logoPath: '/9ghgSC0MA0RDoQIyIzGqRIOhtNx.jpg' }],
      buy: [{ providerId: 3, providerName: 'Google Play Movies', logoPath: '/8z7rC8uIDaTM91X0ZPtEkoYh0M.jpg' }]
    },
    similar: []
  },

  // 2. 3 Idiots (Bollywood Classic)
  {
    id: 20453,
    mediaType: 'movie',
    title: '3 Idiots',
    originalTitle: '3 Idiots',
    overview: 'Rascal. Joker. Dreamer. Genius... You\'ve never met a college student quite like "Rancho." From the moment he arrives at India\'s most prestigious engineering college, his outlandish schemes turn the school upside down—and change the lives of two friends forever.',
    posterPath: '/7flkA1zXqg7qK9lQ0w2UqN7v8dI.jpg',
    backdropPath: '/u7i3eT5P6d3f2c.jpg',
    releaseDate: '2009-12-25',
    releaseYear: 2009,
    voteAverage: 8.0,
    voteCount: 2200,
    genreIds: [35, 18],
    genreNames: ['Comedy', 'Drama'],
    originalLanguage: 'hi',
    popularity: 45.2,
    adult: false,
    tagline: 'Don\'t chase success. Chase excellence, and success will chase you.',
    status: 'Released',
    runtime: 170,
    budget: 11000000,
    revenue: 65000000,
    credits: {
      cast: [
        { id: 5222, name: 'Aamir Khan', character: 'Ranchhoddas "Rancho" Chhanchad', profilePath: '/8aM8y1v.jpg', order: 0 },
        { id: 71203, name: 'R. Madhavan', character: 'Farhan Qureshi', profilePath: '/r1893k.jpg', order: 1 },
        { id: 71204, name: 'Sharman Joshi', character: 'Raju Rastogi', profilePath: '/sh481.jpg', order: 2 },
        { id: 35147, name: 'Kareena Kapoor Khan', character: 'Pia Sahastrabuddhe', profilePath: '/kk199.jpg', order: 3 }
      ],
      crew: [{ id: 71201, name: 'Rajkumar Hirani', job: 'Director', department: 'Directing', profilePath: '/rh291.jpg' }],
      directors: [{ id: 71201, name: 'Rajkumar Hirani', job: 'Director', department: 'Directing', profilePath: '/rh291.jpg' }]
    },
    trailers: [{ id: '2', key: 'K0eDlFX9GMc', name: '3 Idiots Official Trailer', type: 'Trailer' }],
    watchProviders: {
      country: 'US',
      flatrate: [{ providerId: 119, providerName: 'Amazon Prime Video', logoPath: '/emthp39XA2wNsJn2Bp7W.jpg' }],
      rent: [],
      buy: [{ providerId: 2, providerName: 'Apple TV', logoPath: '/9ghgSC0MA0RDoQIyIzGqRIOhtNx.jpg' }]
    },
    similar: []
  },

  // 3. Breaking Bad (TV Masterpiece)
  {
    id: 1396,
    mediaType: 'tv',
    title: 'Breaking Bad',
    originalTitle: 'Breaking Bad',
    overview: 'Walter White, a New Mexico chemistry teacher, is diagnosed with Stage III cancer and given a prognosis of two years left to live. He chooses to enter a dangerous world of drugs and crime with ex-student Jesse Pinkman to secure his family\'s financial future.',
    posterPath: '/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
    backdropPath: '/tsRy63Mu5cu8etL1X7ZLyf7UP1M.jpg',
    releaseDate: '2008-01-20',
    releaseYear: 2008,
    voteAverage: 8.9,
    voteCount: 14000,
    genreIds: [18, 80],
    genreNames: ['Drama', 'Crime'],
    originalLanguage: 'en',
    popularity: 130.4,
    adult: false,
    tagline: 'Change the equation.',
    status: 'Ended',
    runtime: 47,
    numberOfSeasons: 5,
    numberOfEpisodes: 62,
    seasons: [
      { id: 3572, seasonNumber: 1, name: 'Season 1', episodeCount: 7, airDate: '2008-01-20', posterPath: '/1BP4xYv9ZG4VJv5.jpg', overview: 'Walter White begins his descent into the criminal underworld.' },
      { id: 3573, seasonNumber: 2, name: 'Season 2', episodeCount: 13, airDate: '2009-03-08', posterPath: '/2BP4xYv9ZG4VJv5.jpg', overview: 'Walt and Jesse struggle to expand their meth distribution empire.' },
      { id: 3574, seasonNumber: 3, name: 'Season 3', episodeCount: 13, airDate: '2010-03-21', posterPath: '/3BP4xYv9ZG4VJv5.jpg', overview: 'Gus Fring offers Walt a high-tech lab and lucrative partnership.' },
      { id: 3575, seasonNumber: 4, name: 'Season 4', episodeCount: 13, airDate: '2011-07-17', posterPath: '/4BP4xYv9ZG4VJv5.jpg', overview: 'A deadly game of cat and mouse between Walter and Gus.' },
      { id: 3576, seasonNumber: 5, name: 'Season 5', episodeCount: 16, airDate: '2012-07-15', posterPath: '/5BP4xYv9ZG4VJv5.jpg', overview: 'The final, unforgettable downfall of Heisenberg.' }
    ],
    credits: {
      cast: [
        { id: 17419, name: 'Bryan Cranston', character: 'Walter White', profilePath: '/7Jahy5LZX2Fo.jpg', order: 0 },
        { id: 84497, name: 'Aaron Paul', character: 'Jesse Pinkman', profilePath: '/u8tamls.jpg', order: 1 },
        { id: 134531, name: 'Anna Gunn', character: 'Skyler White', profilePath: '/3s99x.jpg', order: 2 },
        { id: 29994, name: 'Giancarlo Esposito', character: 'Gus Fring', profilePath: '/5hK1.jpg', order: 3 }
      ],
      crew: [{ id: 66633, name: 'Vince Gilligan', job: 'Creator', department: 'Writing', profilePath: '/vg192.jpg' }],
      directors: [{ id: 66633, name: 'Vince Gilligan', job: 'Director', department: 'Directing', profilePath: '/vg192.jpg' }]
    },
    trailers: [{ id: '3', key: 'HhesaQXLuRY', name: 'Series Trailer', type: 'Trailer' }],
    watchProviders: {
      country: 'US',
      flatrate: [{ providerId: 8, providerName: 'Netflix', logoPath: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' }],
      rent: [],
      buy: [{ providerId: 2, providerName: 'Apple TV', logoPath: '/9ghgSC0MA0RDoQIyIzGqRIOhtNx.jpg' }]
    },
    similar: []
  },

  // 4. Parasite (Korean Oscar Winner)
  {
    id: 496243,
    mediaType: 'movie',
    title: 'Parasite',
    originalTitle: '기생충',
    overview: 'All unemployed, Ki-taek\'s family takes peculiar interest in the wealthy and glamorous Parks for their livelihood until they get entangled in an unexpected incident.',
    posterPath: '/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
    backdropPath: '/hiKmpZMGZsrkA3cdce8a7Dpos1j.jpg',
    releaseDate: '2019-05-30',
    releaseYear: 2019,
    voteAverage: 8.5,
    voteCount: 18000,
    genreIds: [35, 53, 18],
    genreNames: ['Comedy', 'Thriller', 'Drama'],
    originalLanguage: 'ko',
    popularity: 88.3,
    adult: false,
    tagline: 'Act like you own the place.',
    status: 'Released',
    runtime: 133,
    budget: 11400000,
    revenue: 263100000,
    credits: {
      cast: [
        { id: 20738, name: 'Song Kang-ho', character: 'Kim Ki-taek', profilePath: '/skh19.jpg', order: 0 },
        { id: 1042728, name: 'Lee Sun-kyun', character: 'Park Dong-ik', profilePath: '/lsk88.jpg', order: 1 },
        { id: 1253360, name: 'Cho Yeo-jeong', character: 'Choi Yeon-gyo', profilePath: '/cyj23.jpg', order: 2 },
        { id: 1290481, name: 'Choi Woo-shik', character: 'Kim Ki-woo', profilePath: '/cws10.jpg', order: 3 }
      ],
      crew: [{ id: 21684, name: 'Bong Joon-ho', job: 'Director', department: 'Directing', profilePath: '/bjh19.jpg' }],
      directors: [{ id: 21684, name: 'Bong Joon-ho', job: 'Director', department: 'Directing', profilePath: '/bjh19.jpg' }]
    },
    trailers: [{ id: '4', key: '5xH0Rqa11e4', name: 'Official Trailer', type: 'Trailer' }],
    watchProviders: {
      country: 'US',
      flatrate: [{ providerId: 15, providerName: 'Hulu', logoPath: '/giwM8XDmiV29xc9KiGhSquFGmTI.jpg' }],
      rent: [{ providerId: 2, providerName: 'Apple TV', logoPath: '/9ghgSC0MA0RDoQIyIzGqRIOhtNx.jpg' }],
      buy: [{ providerId: 3, providerName: 'Google Play Movies', logoPath: '/8z7rC8uIDaTM91X0ZPtEkoYh0M.jpg' }]
    },
    similar: []
  },

  // 5. Spirited Away (Japanese Anime Masterpiece)
  {
    id: 129,
    mediaType: 'movie',
    title: 'Spirited Away',
    originalTitle: '千と千尋の神隠し',
    overview: 'A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.',
    posterPath: '/39wmItIWsg5sZMyRUHLkWBcuVCM.jpg',
    backdropPath: '/bXNvzjYE9rvBA2L2S1t9mP86hsm.jpg',
    releaseDate: '2001-07-20',
    releaseYear: 2001,
    voteAverage: 8.5,
    voteCount: 16000,
    genreIds: [16, 14, 10751],
    genreNames: ['Animation', 'Fantasy', 'Family'],
    originalLanguage: 'ja',
    popularity: 76.1,
    adult: false,
    tagline: 'The tunnel led Chihiro to a mysterious town...',
    status: 'Released',
    runtime: 125,
    budget: 19000000,
    revenue: 395800000,
    credits: {
      cast: [
        { id: 19588, name: 'Rumi Hiiragi', character: 'Chihiro Ogino / Sen (voice)', profilePath: null, order: 0 },
        { id: 19589, name: 'Miyu Irino', character: 'Haku (voice)', profilePath: null, order: 1 },
        { id: 19590, name: 'Mari Natsuki', character: 'Yubaba / Zeniba (voice)', profilePath: null, order: 2 }
      ],
      crew: [{ id: 608, name: 'Hayao Miyazaki', job: 'Director', department: 'Directing', profilePath: '/hm101.jpg' }],
      directors: [{ id: 608, name: 'Hayao Miyazaki', job: 'Director', department: 'Directing', profilePath: '/hm101.jpg' }]
    },
    trailers: [{ id: '5', key: 'ByXuk9QqQkk', name: 'Official Trailer', type: 'Trailer' }],
    watchProviders: {
      country: 'US',
      flatrate: [{ providerId: 384, providerName: 'Max', logoPath: '/mXE0jV03S59W.jpg' }],
      rent: [{ providerId: 2, providerName: 'Apple TV', logoPath: '/9ghgSC0MA0RDoQIyIzGqRIOhtNx.jpg' }],
      buy: [{ providerId: 3, providerName: 'Google Play Movies', logoPath: '/8z7rC8uIDaTM91X0ZPtEkoYh0M.jpg' }]
    },
    similar: []
  },

  // 6. Squid Game (Korean TV Sensation)
  {
    id: 93405,
    mediaType: 'tv',
    title: 'Squid Game',
    originalTitle: '오징어 게임',
    overview: 'Hundreds of cash-strapped players accept a strange invitation to compete in children\'s games. Inside, a tempting prize awaits with deadly high stakes: a survival game that has a whopping 45.6 billion-won prize at stake.',
    posterPath: '/dDlGcuPvN83q5s1Y9Wz5P3T.jpg',
    backdropPath: '/oaGvjB0DvdNDWhfPtMAukakq.jpg',
    releaseDate: '2021-09-17',
    releaseYear: 2021,
    voteAverage: 7.8,
    voteCount: 14500,
    genreIds: [10759, 9648, 18],
    genreNames: ['Action & Adventure', 'Mystery', 'Drama'],
    originalLanguage: 'ko',
    popularity: 110.2,
    adult: false,
    tagline: '45.6 Billion is child\'s play.',
    status: 'Returning Series',
    runtime: 55,
    numberOfSeasons: 2,
    numberOfEpisodes: 15,
    seasons: [
      { id: 131977, seasonNumber: 1, name: 'Season 1', episodeCount: 9, airDate: '2021-09-17', posterPath: '/dDlGcuPvN83q5s1Y9Wz5P3T.jpg', overview: 'Seong Gi-hun enters the deadly arena to pay off debts.' },
      { id: 374921, seasonNumber: 2, name: 'Season 2', episodeCount: 6, airDate: '2024-12-26', posterPath: '/sg2Poster.jpg', overview: 'Gi-hun abandons his plans to go to the United States and starts a chase with a motive.' }
    ],
    credits: {
      cast: [
        { id: 73249, name: 'Lee Jung-jae', character: 'Seong Gi-hun (No. 456)', profilePath: '/ljj99.jpg', order: 0 },
        { id: 216480, name: 'Park Hae-soo', character: 'Cho Sang-woo (No. 218)', profilePath: '/phs12.jpg', order: 1 },
        { id: 2843477, name: 'Jung Ho-yeon', character: 'Kang Sae-byeok (No. 067)', profilePath: '/jhy01.jpg', order: 2 }
      ],
      crew: [{ id: 1253363, name: 'Hwang Dong-hyuk', job: 'Creator', department: 'Writing', profilePath: '/hdh10.jpg' }],
      directors: [{ id: 1253363, name: 'Hwang Dong-hyuk', job: 'Director', department: 'Directing', profilePath: '/hdh10.jpg' }]
    },
    trailers: [{ id: '6', key: 'oqxAJKy0ii4', name: 'Official Trailer', type: 'Trailer' }],
    watchProviders: {
      country: 'US',
      flatrate: [{ providerId: 8, providerName: 'Netflix', logoPath: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' }],
      rent: [],
      buy: []
    },
    similar: []
  },

  // 7. RRR (Indian Global Epic)
  {
    id: 579974,
    mediaType: 'movie',
    title: 'RRR',
    originalTitle: 'RRR',
    overview: 'A fictional history of two legendary revolutionaries\' journey away from home before they began fighting for their country in the 1920s.',
    posterPath: '/wE0noFUqUqNVQbd51u7B.jpg',
    backdropPath: '/707thQazsn1.jpg',
    releaseDate: '2022-03-24',
    releaseYear: 2022,
    voteAverage: 7.8,
    voteCount: 1600,
    genreIds: [28, 18, 12],
    genreNames: ['Action', 'Drama', 'Adventure'],
    originalLanguage: 'te',
    popularity: 58.7,
    adult: false,
    tagline: 'Rise. Roar. Revolt.',
    status: 'Released',
    runtime: 187,
    budget: 72000000,
    revenue: 160000000,
    credits: {
      cast: [
        { id: 104595, name: 'N.T. Rama Rao Jr.', character: 'Komaram Bheem', profilePath: '/ntr1.jpg', order: 0 },
        { id: 104594, name: 'Ram Charan', character: 'Alluri Sitarama Raju', profilePath: '/rc2.jpg', order: 1 },
        { id: 1108120, name: 'Alia Bhatt', character: 'Sita', profilePath: '/ab3.jpg', order: 2 },
        { id: 85034, name: 'Ajay Devgn', character: 'Venkata Rama Raju', profilePath: '/ad4.jpg', order: 3 }
      ],
      crew: [{ id: 85038, name: 'S.S. Rajamouli', job: 'Director', department: 'Directing', profilePath: '/ssr.jpg' }],
      directors: [{ id: 85038, name: 'S.S. Rajamouli', job: 'Director', department: 'Directing', profilePath: '/ssr.jpg' }]
    },
    trailers: [{ id: '7', key: 'NgBoMJy386M', name: 'Official Trailer', type: 'Trailer' }],
    watchProviders: {
      country: 'US',
      flatrate: [{ providerId: 8, providerName: 'Netflix', logoPath: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' }],
      rent: [],
      buy: []
    },
    similar: []
  },

  // 8. Dark (German Sci-Fi Thriller TV Show)
  {
    id: 70523,
    mediaType: 'tv',
    title: 'Dark',
    originalTitle: 'Dark',
    overview: 'A missing child causes four families to help each other for answers. What they could not imagine is that this mystery would be connected to innumerable other secrets of the small town of Winden across three generations.',
    posterPath: '/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg',
    backdropPath: '/3lBDg3opqukjRj.jpg',
    releaseDate: '2017-12-01',
    releaseYear: 2017,
    voteAverage: 8.4,
    voteCount: 6500,
    genreIds: [10765, 9648, 18],
    genreNames: ['Sci-Fi & Fantasy', 'Mystery', 'Drama'],
    originalLanguage: 'de',
    popularity: 72.1,
    adult: false,
    tagline: 'The question is not where, but when.',
    status: 'Ended',
    runtime: 60,
    numberOfSeasons: 3,
    numberOfEpisodes: 26,
    seasons: [
      { id: 86120, seasonNumber: 1, name: 'Season 1', episodeCount: 10, airDate: '2017-12-01', posterPath: '/apbrbWs8M9lyOpJYU5WXrpFbk1Z.jpg', overview: 'A disappearance kicks off an intricate web of secrets and past loops.' },
      { id: 119842, seasonNumber: 2, name: 'Season 2', episodeCount: 8, airDate: '2019-06-21', posterPath: '/darkS2.jpg', overview: 'The apocalypse approaches as Jonas travels forward in time.' },
      { id: 145920, seasonNumber: 3, name: 'Season 3', episodeCount: 8, airDate: '2020-06-27', posterPath: '/darkS3.jpg', overview: 'The final cycle connects two alternate realities and the origin.' }
    ],
    credits: {
      cast: [
        { id: 1391942, name: 'Louis Hofmann', character: 'Jonas Kahnwald', profilePath: '/lh10.jpg', order: 0 },
        { id: 1729481, name: 'Lisa Vicari', character: 'Martha Nielsen', profilePath: '/lv12.jpg', order: 1 }
      ],
      crew: [{ id: 119041, name: 'Baran bo Odar', job: 'Director', department: 'Directing', profilePath: '/bbo.jpg' }],
      directors: [{ id: 119041, name: 'Baran bo Odar', job: 'Director', department: 'Directing', profilePath: '/bbo.jpg' }]
    },
    trailers: [{ id: '8', key: 'rrwycJ08PSA', name: 'Official Trailer', type: 'Trailer' }],
    watchProviders: {
      country: 'US',
      flatrate: [{ providerId: 8, providerName: 'Netflix', logoPath: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' }],
      rent: [],
      buy: []
    },
    similar: []
  },

  // 9. Amélie (French Cinema Masterpiece)
  {
    id: 194,
    mediaType: 'movie',
    title: 'Amélie',
    originalTitle: 'Le Fabuleux Destin d\'Amélie Poulain',
    overview: 'Amélie is an innocent and naive girl in Paris with her own sense of justice. She decides to help those around her and, along the way, discovers love.',
    posterPath: '/gFQ25eI593.jpg',
    backdropPath: '/amelieBg.jpg',
    releaseDate: '2001-04-25',
    releaseYear: 2001,
    voteAverage: 7.9,
    voteCount: 11000,
    genreIds: [35, 10749],
    genreNames: ['Comedy', 'Romance'],
    originalLanguage: 'fr',
    popularity: 42.8,
    adult: false,
    tagline: 'She\'ll change your life.',
    status: 'Released',
    runtime: 122,
    budget: 10000000,
    revenue: 174200000,
    credits: {
      cast: [
        { id: 1533, name: 'Audrey Tautou', character: 'Amélie Poulain', profilePath: '/at9.jpg', order: 0 },
        { id: 1534, name: 'Mathieu Kassovitz', character: 'Nino Quincampoix', profilePath: '/mk1.jpg', order: 1 }
      ],
      crew: [{ id: 1532, name: 'Jean-Pierre Jeunet', job: 'Director', department: 'Directing', profilePath: '/jpj.jpg' }],
      directors: [{ id: 1532, name: 'Jean-Pierre Jeunet', job: 'Director', department: 'Directing', profilePath: '/jpj.jpg' }]
    },
    trailers: [{ id: '9', key: 'HUECWi5pX7o', name: 'Official Trailer', type: 'Trailer' }],
    watchProviders: {
      country: 'US',
      flatrate: [],
      rent: [{ providerId: 2, providerName: 'Apple TV', logoPath: '/9ghgSC0MA0RDoQIyIzGqRIOhtNx.jpg' }],
      buy: [{ providerId: 3, providerName: 'Google Play Movies', logoPath: '/8z7rC8uIDaTM91X0ZPtEkoYh0M.jpg' }]
    },
    similar: []
  },

  // 10. Attack on Titan (Japanese Anime Phenomenon)
  {
    id: 1429,
    mediaType: 'tv',
    title: 'Attack on Titan',
    originalTitle: '進撃の巨人',
    overview: 'After his hometown is destroyed and his mother is killed, young Eren Jaeger vows to cleanse the earth of the giant humanoid Titans that have brought humanity to the brink of extinction.',
    posterPath: '/hTP1tW22woo2rGLq2U86gh9.jpg',
    backdropPath: '/aotBg.jpg',
    releaseDate: '2013-04-07',
    releaseYear: 2013,
    voteAverage: 8.7,
    voteCount: 6200,
    genreIds: [16, 10759, 10765],
    genreNames: ['Animation', 'Action & Adventure', 'Sci-Fi & Fantasy'],
    originalLanguage: 'ja',
    popularity: 95.8,
    adult: false,
    tagline: 'To win, we must fight.',
    status: 'Ended',
    runtime: 24,
    numberOfSeasons: 4,
    numberOfEpisodes: 89,
    seasons: [
      { id: 2410, seasonNumber: 1, name: 'Season 1', episodeCount: 25, airDate: '2013-04-07', posterPath: '/aotS1.jpg', overview: 'The fall of Wall Maria.' },
      { id: 86450, seasonNumber: 2, name: 'Season 2', episodeCount: 12, airDate: '2017-04-01', posterPath: '/aotS2.jpg', overview: 'Titans within the walls.' },
      { id: 104520, seasonNumber: 3, name: 'Season 3', episodeCount: 22, airDate: '2018-07-23', posterPath: '/aotS3.jpg', overview: 'The battle to retake Wall Maria and the basement truth.' },
      { id: 152890, seasonNumber: 4, name: 'The Final Season', episodeCount: 30, airDate: '2020-12-07', posterPath: '/aotS4.jpg', overview: 'The devastating war beyond the sea and the rumbling.' }
    ],
    credits: {
      cast: [
        { id: 124147, name: 'Yuki Kaji', character: 'Eren Jaeger (voice)', profilePath: '/yk.jpg', order: 0 },
        { id: 124148, name: 'Yui Ishikawa', character: 'Mikasa Ackerman (voice)', profilePath: '/yi.jpg', order: 1 },
        { id: 124149, name: 'Hiroshi Kamiya', character: 'Levi Ackerman (voice)', profilePath: '/hk.jpg', order: 2 }
      ],
      crew: [{ id: 124146, name: 'Tetsuro Araki', job: 'Director', department: 'Directing', profilePath: '/ta.jpg' }],
      directors: [{ id: 124146, name: 'Tetsuro Araki', job: 'Director', department: 'Directing', profilePath: '/ta.jpg' }]
    },
    trailers: [{ id: '10', key: 'MGRm4IzK1SQ', name: 'Trailer', type: 'Trailer' }],
    watchProviders: {
      country: 'US',
      flatrate: [{ providerId: 15, providerName: 'Hulu', logoPath: '/giwM8XDmiV29xc9KiGhSquFGmTI.jpg' }, { providerId: 283, providerName: 'Crunchyroll', logoPath: '/cr.jpg' }],
      rent: [],
      buy: []
    },
    similar: []
  },

  // 11. Eyes Wide Shut (18+ Adult Cinema Classic - NC-17 / R)
  {
    id: 345,
    mediaType: 'movie',
    title: 'Eyes Wide Shut',
    originalTitle: 'Eyes Wide Shut',
    overview: 'A Manhattan doctor embarks on a bizarre, night-long sexual odyssey after his wife admits to having had sexual fantasies about a naval officer she met on vacation.',
    posterPath: '/knEIOwGq4V7xV92.jpg',
    backdropPath: '/ewsBg.jpg',
    releaseDate: '1999-07-16',
    releaseYear: 1999,
    voteAverage: 7.5,
    voteCount: 5600,
    genreIds: [18, 9648],
    genreNames: ['Drama', 'Mystery'],
    originalLanguage: 'en',
    popularity: 38.9,
    adult: true,
    tagline: 'Cruise. Kidman. Kubrick.',
    status: 'Released',
    runtime: 159,
    budget: 65000000,
    revenue: 162100000,
    certification: 'NC-17',
    credits: {
      cast: [
        { id: 500, name: 'Tom Cruise', character: 'Dr. William Harford', profilePath: '/tc1.jpg', order: 0 },
        { id: 2227, name: 'Nicole Kidman', character: 'Alice Harford', profilePath: '/nk1.jpg', order: 1 }
      ],
      crew: [{ id: 240, name: 'Stanley Kubrick', job: 'Director', department: 'Directing', profilePath: '/sk.jpg' }],
      directors: [{ id: 240, name: 'Stanley Kubrick', job: 'Director', department: 'Directing', profilePath: '/sk.jpg' }]
    },
    trailers: [{ id: '11', key: 'YeecWl3b78Y', name: 'Trailer', type: 'Trailer' }],
    watchProviders: {
      country: 'US',
      flatrate: [{ providerId: 384, providerName: 'Max', logoPath: '/mXE0jV03S59W.jpg' }],
      rent: [{ providerId: 2, providerName: 'Apple TV', logoPath: '/9ghgSC0MA0RDoQIyIzGqRIOhtNx.jpg' }],
      buy: []
    },
    similar: []
  },

  // 12. Blue Is the Warmest Color (18+ French Uncensored / NC-17 Romance Drama)
  {
    id: 152584,
    mediaType: 'movie',
    title: 'Blue Is the Warmest Color',
    originalTitle: 'La Vie d\'Adèle - Chapitres 1 & 2',
    overview: 'Adèle\'s life is changed when she meets Emma, a young woman with blue hair, who will allow her to discover desire and to assert herself as a woman and as an adult. In front of others, Adèle grows, seeks herself, loses herself, and finds herself through love and loss.',
    posterPath: '/vVnQeD9eH4.jpg',
    backdropPath: '/blueWarmBg.jpg',
    releaseDate: '2013-10-09',
    releaseYear: 2013,
    voteAverage: 7.4,
    voteCount: 4200,
    genreIds: [18, 10749],
    genreNames: ['Drama', 'Romance'],
    originalLanguage: 'fr',
    popularity: 34.6,
    adult: true,
    tagline: 'Passion has no boundaries.',
    status: 'Released',
    runtime: 180,
    budget: 5000000,
    revenue: 19500000,
    certification: 'NC-17',
    credits: {
      cast: [
        { id: 1083437, name: 'Adèle Exarchopoulos', character: 'Adèle', profilePath: '/ae.jpg', order: 0 },
        { id: 2274, name: 'Léa Seydoux', character: 'Emma', profilePath: '/ls.jpg', order: 1 }
      ],
      crew: [{ id: 2273, name: 'Abdellatif Kechiche', job: 'Director', department: 'Directing', profilePath: '/ak.jpg' }],
      directors: [{ id: 2273, name: 'Abdellatif Kechiche', job: 'Director', department: 'Directing', profilePath: '/ak.jpg' }]
    },
    trailers: [{ id: '12', key: 'Y259b32Y', name: 'Trailer', type: 'Trailer' }],
    watchProviders: {
      country: 'US',
      flatrate: [{ providerId: 11, providerName: 'MUBI', logoPath: '/mubi.jpg' }],
      rent: [{ providerId: 2, providerName: 'Apple TV', logoPath: '/9ghgSC0MA0RDoQIyIzGqRIOhtNx.jpg' }],
      buy: []
    },
    similar: []
  },

  // 13. In the Realm of the Senses (18+ Japanese Uncensored Classic - R18+)
  {
    id: 5940,
    mediaType: 'movie',
    title: 'In the Realm of the Senses',
    originalTitle: '愛のコリーダ',
    overview: 'In 1936 Tokyo, a former prostitute turned maid begins an intense and consuming sexual relationship with the master of the house she works in.',
    posterPath: '/realmOfSenses.jpg',
    backdropPath: '/realmBg.jpg',
    releaseDate: '1976-05-15',
    releaseYear: 1976,
    voteAverage: 6.8,
    voteCount: 520,
    genreIds: [18, 10749],
    genreNames: ['Drama', 'Romance'],
    originalLanguage: 'ja',
    popularity: 29.3,
    adult: true,
    tagline: 'An erotic obsession that shattered conventions.',
    status: 'Released',
    runtime: 109,
    certification: 'R18+',
    credits: {
      cast: [
        { id: 36725, name: 'Eiko Matsuda', character: 'Sada Abe', profilePath: null, order: 0 },
        { id: 36726, name: 'Tatsuya Fuji', character: 'Kichizo Ishida', profilePath: null, order: 1 }
      ],
      crew: [{ id: 36724, name: 'Nagisa Ōshima', job: 'Director', department: 'Directing', profilePath: null }],
      directors: [{ id: 36724, name: 'Nagisa Ōshima', job: 'Director', department: 'Directing', profilePath: null }]
    },
    trailers: [{ id: '13', key: 'realmTrailer', name: 'Original Trailer', type: 'Trailer' }],
    watchProviders: { country: 'US', flatrate: [{ providerId: 11, providerName: 'Criterion Channel', logoPath: '/crit.jpg' }], rent: [], buy: [] },
    similar: []
  },

  // 14. Gangs of Wasseypur (18+ Bollywood Crime Masterpiece - A Certified)
  {
    id: 84643,
    mediaType: 'movie',
    title: 'Gangs of Wasseypur',
    originalTitle: 'Gangs of Wasseypur',
    overview: 'A clash between Sultan and Shahid Khan leads to the expulsion of Khan from Wasseypur, and ignites a deadly blood feud spanning three generations of families.',
    posterPath: '/gangsOfWasseypur.jpg',
    backdropPath: '/gowBg.jpg',
    releaseDate: '2012-06-22',
    releaseYear: 2012,
    voteAverage: 8.1,
    voteCount: 780,
    genreIds: [28, 80, 18],
    genreNames: ['Action', 'Crime', 'Drama'],
    originalLanguage: 'hi',
    popularity: 38.1,
    adult: true,
    tagline: 'When coal barons fought with blood and bullets.',
    status: 'Released',
    runtime: 321,
    certification: 'A',
    credits: {
      cast: [
        { id: 62590, name: 'Manoj Bajpayee', character: 'Sardar Khan', profilePath: '/mb.jpg', order: 0 },
        { id: 1042730, name: 'Nawazuddin Siddiqui', character: 'Faizal Khan', profilePath: '/ns.jpg', order: 1 },
        { id: 119853, name: 'Richa Chadha', character: 'Nagma Khatun', profilePath: '/rc.jpg', order: 2 }
      ],
      crew: [{ id: 62589, name: 'Anurag Kashyap', job: 'Director', department: 'Directing', profilePath: '/ak2.jpg' }],
      directors: [{ id: 62589, name: 'Anurag Kashyap', job: 'Director', department: 'Directing', profilePath: '/ak2.jpg' }]
    },
    trailers: [{ id: '14', key: 'j-7S8hP3o7M', name: 'Official Trailer', type: 'Trailer' }],
    watchProviders: { country: 'US', flatrate: [{ providerId: 8, providerName: 'Netflix', logoPath: '/pbpMk2JmcoNnQwx5JGpXngfoWtp.jpg' }], rent: [], buy: [] },
    similar: []
  },

  // 15. The Dark Knight
  {
    id: 155,
    mediaType: 'movie',
    title: 'The Dark Knight',
    originalTitle: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations that plague the streets.',
    posterPath: '/qJ2tW6WMUDux911r6m7haRef0WH.jpg',
    backdropPath: '/nMKdUUepR0i5zn0y1T4CsSB5chy.jpg',
    releaseDate: '2008-07-16',
    releaseYear: 2008,
    voteAverage: 8.5,
    voteCount: 32000,
    genreIds: [18, 28, 80, 53],
    genreNames: ['Drama', 'Action', 'Crime', 'Thriller'],
    originalLanguage: 'en',
    popularity: 115.3,
    adult: false,
    tagline: 'Why So Serious?',
    status: 'Released',
    runtime: 152,
    budget: 185000000,
    revenue: 1004558444,
    credits: {
      cast: [
        { id: 3894, name: 'Christian Bale', character: 'Bruce Wayne / Batman', profilePath: '/cb.jpg', order: 0 },
        { id: 1810, name: 'Heath Ledger', character: 'Joker', profilePath: '/hl.jpg', order: 1 },
        { id: 3895, name: 'Michael Caine', character: 'Alfred Pennyworth', profilePath: '/mc.jpg', order: 2 }
      ],
      crew: [{ id: 525, name: 'Christopher Nolan', job: 'Director', department: 'Directing', profilePath: '/cn.jpg' }],
      directors: [{ id: 525, name: 'Christopher Nolan', job: 'Director', department: 'Directing', profilePath: '/cn.jpg' }]
    },
    trailers: [{ id: '15', key: 'EXeTwQWrcwY', name: 'Official Trailer', type: 'Trailer' }],
    watchProviders: { country: 'US', flatrate: [{ providerId: 384, providerName: 'Max', logoPath: '/mXE0jV03S59W.jpg' }], rent: [], buy: [] },
    similar: []
  }
];

export const MOCK_SEASON_EPISODES: Record<string, TVSeasonDetail> = {
  // Breaking Bad S1
  '1396-1': {
    id: 3572,
    seasonNumber: 1,
    name: 'Season 1',
    overview: 'High school chemistry teacher Walter White\'s life is upended when diagnosed with terminal lung cancer.',
    posterPath: '/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg',
    airDate: '2008-01-20',
    episodes: [
      { id: 62085, episodeNumber: 1, name: 'Pilot', overview: 'Walter White learns he has terminal cancer and teams up with Jesse Pinkman to cook meth.', stillPath: '/bbS1E1.jpg', airDate: '2008-01-20', voteAverage: 8.5, voteCount: 6500, runtime: 58 },
      { id: 62086, episodeNumber: 2, name: 'Cat\'s in the Bag...', overview: 'Walt and Jesse attempt to dispose of two bodies, which becomes much harder than anticipated.', stillPath: '/bbS1E2.jpg', airDate: '2008-01-27', voteAverage: 8.3, voteCount: 5200, runtime: 48 },
      { id: 62087, episodeNumber: 3, name: '...And the Bag\'s in the River', overview: 'Walt wrestles with a moral dilemma regarding their surviving captive, Krazy-8.', stillPath: '/bbS1E3.jpg', airDate: '2008-02-10', voteAverage: 8.8, voteCount: 5800, runtime: 48 },
      { id: 62088, episodeNumber: 4, name: 'Cancer Man', overview: 'Walt reveals his cancer diagnosis to his family, while the DEA begins to investigate the new meth in town.', stillPath: '/bbS1E4.jpg', airDate: '2008-02-17', voteAverage: 8.2, voteCount: 4900, runtime: 48 },
      { id: 62089, episodeNumber: 5, name: 'Gray Matter', overview: 'Walt and Skyler attend a wealthy former colleague\'s birthday party where an offer of help triggers pride.', stillPath: '/bbS1E5.jpg', airDate: '2008-02-24', voteAverage: 8.4, voteCount: 5100, runtime: 48 },
      { id: 62090, episodeNumber: 6, name: 'Crazy Handful of Nothin\'', overview: 'Heisenberg is born when Walt shaves his head and faces the dangerous distributor Tuco Salamanca.', stillPath: '/bbS1E6.jpg', airDate: '2008-03-02', voteAverage: 9.3, voteCount: 7800, runtime: 48 },
      { id: 62091, episodeNumber: 7, name: 'A No-Rough-Stuff-Type Deal', overview: 'Walt and Jesse ramp up production to satisfy Tuco\'s massive order, but Tuco proves utterly unhinged.', stillPath: '/bbS1E7.jpg', airDate: '2008-03-09', voteAverage: 8.9, voteCount: 5600, runtime: 48 }
    ]
  },
  // Squid Game S1
  '93405-1': {
    id: 131977,
    seasonNumber: 1,
    name: 'Season 1',
    overview: 'Desperate people risk their lives in deadly children\'s games for a massive jackpot.',
    posterPath: '/dDlGcuPvN83q5s1Y9Wz5P3T.jpg',
    airDate: '2021-09-17',
    episodes: [
      { id: 3183921, episodeNumber: 1, name: 'Red Light, Green Light', overview: 'Hoping to win easy money, a desperate Gi-hun agrees to take part in an enigmatic game.', stillPath: '/sgE1.jpg', airDate: '2021-09-17', voteAverage: 8.4, voteCount: 4100, runtime: 60 },
      { id: 3183922, episodeNumber: 2, name: 'Hell', overview: 'Split on whether to continue or quit, the group holds a vote, but outside reality proves just as punishing.', stillPath: '/sgE2.jpg', airDate: '2021-09-17', voteAverage: 7.9, voteCount: 3200, runtime: 62 },
      { id: 3183923, episodeNumber: 3, name: 'The Man with the Umbrella', overview: 'A few players enter the next round with hidden advantages, carving delicate sugar shapes under deadly stakes.', stillPath: '/sgE3.jpg', airDate: '2021-09-17', voteAverage: 8.2, voteCount: 3500, runtime: 54 },
      { id: 3183924, episodeNumber: 4, name: 'Stick to the Team', overview: 'As alliances form, nobody is safe in the dorm after lights out. Tug of War demands brains and brawn.', stillPath: '/sgE4.jpg', airDate: '2021-09-17', voteAverage: 8.7, voteCount: 3900, runtime: 55 },
      { id: 3183925, episodeNumber: 5, name: 'A Fair World', overview: 'Gi-hun and his team take turns keeping guard through the night while an organ harvesting scheme unravels.', stillPath: '/sgE5.jpg', airDate: '2021-09-17', voteAverage: 7.8, voteCount: 3100, runtime: 51 },
      { id: 3183926, episodeNumber: 6, name: 'Gganbu', overview: 'Players pair up for the fourth game, only to discover heartbreaking rules involving marbles.', stillPath: '/sgE6.jpg', airDate: '2021-09-17', voteAverage: 9.3, voteCount: 6800, runtime: 62 }
    ]
  }
};

export const MOCK_PERSONS: Record<number, PersonDetail> = {
  525: {
    id: 525,
    name: 'Christopher Nolan',
    biography: 'Christopher Edward Nolan is a British-American filmmaker known for his Hollywood blockbusters with complex, non-linear storytelling and practical visual effects.',
    birthday: '1970-07-30',
    deathday: null,
    placeOfBirth: 'Westminster, London, England, UK',
    profilePath: '/xuB7b.jpg',
    knownForDepartment: 'Directing',
    combinedCredits: [
      MOCK_MEDIA_ITEMS[0], // Inception
      MOCK_MEDIA_ITEMS[14] // The Dark Knight
    ]
  },
  6193: {
    id: 6193,
    name: 'Leonardo DiCaprio',
    biography: 'Leonardo Wilhelm DiCaprio is an Academy Award-winning American actor and film producer known for his intense dramatic portrayals and environmental philanthropy.',
    birthday: '1974-11-11',
    deathday: null,
    placeOfBirth: 'Los Angeles, California, USA',
    profilePath: '/wo2Configuration.jpg',
    knownForDepartment: 'Acting',
    combinedCredits: [
      MOCK_MEDIA_ITEMS[0] // Inception
    ]
  },
  5222: {
    id: 5222,
    name: 'Aamir Khan',
    biography: 'Mohammed Aamir Hussain Khan is an Indian actor, director, and filmmaker who has established himself as one of the most influential actors of Indian cinema globally.',
    birthday: '1965-03-14',
    deathday: null,
    placeOfBirth: 'Mumbai, Maharashtra, India',
    profilePath: '/8aM8y1v.jpg',
    knownForDepartment: 'Acting',
    combinedCredits: [
      MOCK_MEDIA_ITEMS[1] // 3 Idiots
    ]
  }
};
