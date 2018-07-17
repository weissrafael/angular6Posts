import { Post } from './post';

export const POSTS: Post[] = [
  {
    id: 3,
    date: '03/17/18',
    message: 'Yesterday people asked to me more than 3 times if I was ok. Maybe Im not.',
    beingEdited: false,
    userPopUp: false,
    user: { id: 4, username: 'beau', phone: '992312312', role: 'PR', name: 'Beau Siegel'},
  },
  {
    id: 2,
    date: '03/14/18',
    message: 'I loved the 2 colors you choose',
    beingEdited: false,
    userPopUp: false,
    user: { id: 0, username: 'mathilde', phone: '992312312', role: 'CEO', name: 'Mathilde Saylors'},
  },
  {
    id: 0,
    date: '03/14/17',
    message: 'First Message ever created!',
    beingEdited: false,
    userPopUp: false,
    user: { id: 3, username: 'piedad', phone: '992312312', role: 'Sales', name: 'Piedad Dewald'}
  },
  {
    id: 1,
    date: '01/12/18',
    message: 'Cool website bro congratulations !!1!',
    beingEdited: false,
    userPopUp: false,
    user: { id: 2, username: 'freeman', phone: '992312312', role: 'Developer', name: 'Freeman Litten'}
  }
];
