import astropodConfig from '../../.astropod/astropod.config.json'
import { getCollection } from 'astro:content'

import { markdownToTxt } from 'markdown-to-txt'
import { Podcast } from 'podcast'

let episodes = await getCollection('episode')
episodes.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())

export async function GET() {
  const feed = new Podcast({
    title: astropodConfig.name,
    description: astropodConfig.description,
    siteUrl: astropodConfig.link,
    feedUrl: astropodConfig.link + astropodConfig.feed,
    imageUrl: astropodConfig.link + astropodConfig.cover,
    author: astropodConfig.author,
    language: astropodConfig.language,
    categories: astropodConfig.category,
    itunesAuthor: astropodConfig.author,
    itunesImage: astropodConfig.link + astropodConfig.cover,
    itunesSummary: astropodConfig.description,
    itunesType: 'episodic',
    itunesExplicit: astropodConfig.explicit,
    itunesOwner: { name: astropodConfig.author, email: astropodConfig.email },
  })

  episodes.forEach(episode => {
    feed.addItem({
      title: episode.data.title,
      description: markdownToTxt(episode.body),
      imageUrl: astropodConfig.link + episode.data.cover,
      url: `${astropodConfig.link}/episode/${episode.slug}/`,
      guid: `${astropodConfig.link}/episode/${episode.slug}/`,
      date: episode.data.pubDate,
      enclosure: {
        url: astropodConfig.link + episode.data.audioUrl,
        size: episode.data.size * 1000000,
        type: 'audio/mpeg',
      },
      itunesAuthor: astropodConfig.author,
      itunesSummary: markdownToTxt(episode.body),
      itunesEpisode: episode.data.episode,
      itunesSeason: episode.data.season,
      itunesImage: astropodConfig.link + episode.data.cover,
      itunesEpisodeType: episode.data.episodeType,
      itunesExplicit: episode.data.explicit,
      itunesDuration: episode.data.duration,
    })
  })

  return new Response(feed.buildXml(), {
    headers: { 'Content-Type': 'text/xml' },
  })
}
