import { Post } from './post';

export const POSTS: Post[] = [
  {
    id: 3,
    date: '03/17/18',
    ownerId: 0,
    ownerName: 'Beau Siegel',
    message: 'Yesterday people asked to me, more than 3 times, if I was ok. Maybe Im not.',
    beingEdited: false
  },
  { id: 2, date: '03/14/18', ownerId: 0, ownerName: 'Mathilde Saylors', message: 'I loved the 2 colors you choose', beingEdited: false},
  { id: 0, date: '03/14/17', ownerId: 777, ownerName: 'You', message: 'First Message ever created!', beingEdited: false},
  { id: 1, date: '01/12/18', ownerId: 2, ownerName: 'Freeman Litten', message: 'Cool website bro congratulations !!1!', beingEdited: false}
];
