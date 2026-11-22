import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from '../src/app/page';
import { client } from '../src/sanity/client';

// The page is an async server component that fetches posts from Sanity;
// mock the client so the test doesn't hit the network.
jest.mock('../src/sanity/client', () => ({
  client: { fetch: jest.fn() },
}));

const fetchMock = client.fetch as jest.Mock;

describe('Page', () => {
  beforeEach(() => {
    fetchMock.mockReset();
  });

  it('should render successfully', async () => {
    fetchMock.mockResolvedValue([]);

    // Async server components can't be passed to render() directly:
    // resolve the component first, then render the JSX it returns.
    const { baseElement } = render(await Page());

    expect(baseElement).toBeTruthy();
    expect(screen.getByRole('heading', { name: 'Posts' })).toBeTruthy();
  });

  it('should render a link for each post', async () => {
    fetchMock.mockResolvedValue([
      {
        _id: '1',
        title: 'First post',
        slug: { current: 'first-post' },
        publishedAt: '2024-01-15T00:00:00Z',
      },
      {
        _id: '2',
        title: 'Second post',
        slug: { current: 'second-post' },
        publishedAt: '2024-02-20T00:00:00Z',
      },
    ]);

    render(await Page());

    expect(screen.getAllByRole('listitem')).toHaveLength(2);
    expect(
      screen.getByRole('link', { name: /First post/ }).getAttribute('href')
    ).toBe('/first-post');
    expect(
      screen.getByRole('link', { name: /Second post/ }).getAttribute('href')
    ).toBe('/second-post');
  });
});
