import { AppPage } from './app.po';

describe('ng-eventstore-listing App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('should display welcome message', async () => {
    page.navigateTo();
    expect(await page.getParagraphText()).toEqual('Welcome to app!');
  });
});
