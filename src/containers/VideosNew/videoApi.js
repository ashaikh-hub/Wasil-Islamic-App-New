import axios from 'axios';

const BASE = 'https://islamicapp.vercel.app/api';

export const fetchChannels = async () => (await axios.get(`${BASE}/videochannels`)).data || [];
export const fetchSpeakers = async () => (await axios.get(`${BASE}/speakers`)).data || [];
export const fetchByChannel = async (channel) =>
  (await axios.get(`${BASE}/videobychannel`, { params: { videochannelname: channel } })).data || [];
export const fetchBySpeaker = async (speakerId) => (await axios.get(`${BASE}/videos`, { params: { speakerId } })).data || [];

// Last path segment of a YouTube share/embed link.
export const youtubeId = (link = '') => link.split('?')[0].split('/').filter(Boolean).pop() || '';

// Where a channel chip should take the user. Some channels use a different listing or query name.
export const channelRoute = (channelName) => {
  if (channelName === 'Durs and Podcast') return ['BySpeakersNew'];
  if (channelName === 'Recitation Videos') return ['RecitaionDetailNew', { channelname: 'Recitation', name: channelName }];
  if (channelName === 'Kids Videos') return ['ChannelsDetailNew', { channelname: 'Kids', name: channelName }];
  return ['ChannelsDetailNew', { channelname: channelName, name: channelName }];
};
