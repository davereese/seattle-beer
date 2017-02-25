import { SeattleBeerPage } from './app.po';

describe('seattle-beer App', () => {
  let page: SeattleBeerPage;

  beforeEach(() => {
    page = new SeattleBeerPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
