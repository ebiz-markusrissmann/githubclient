import { mock, mockReset } from 'jest-mock-extended';
import { Octokit } from 'octokit';
import { GithubSecrets } from '../src/github-secrets';

describe('Test GithubSecrets', () => {
  const octokitMock = mock<Octokit>();

  const responseGetSecret: any = {
    status: 200,
    url: 'https://api.github.com/repos/ebiz-markusrissmann/mwaa-pitch/actions/secrets/AWS_ACCESS_KEY',
    headers: {
      'access-control-allow-origin': '*',
      'access-control-expose-headers':
        'ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, X-GitHub-SSO, X-GitHub-Request-Id, Deprecation, Sunset',
      'cache-control': 'private, max-age=60, s-maxage=60',
      'content-encoding': 'gzip',
      'content-security-policy': "default-src 'none'",
      'content-type': 'application/json; charset=utf-8',
      date: 'Mon, 27 Feb 2023 14:07:43 GMT',
      etag: 'W/"927826e3dcd9e0cf1d8e7d9b52df4761a13bb7bea8f35e3638f41ff431777c49"',
      'github-authentication-token-expiration': '2023-03-03 17:13:49 UTC',
      'referrer-policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',
      server: 'GitHub.com',
      'strict-transport-security': 'max-age=31536000; includeSubdomains; preload',
      'transfer-encoding': 'chunked',
      vary: 'Accept, Authorization, Cookie, X-GitHub-OTP, Accept-Encoding, Accept, X-Requested-With',
      'x-accepted-oauth-scopes': '',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'deny',
      'x-github-api-version-selected': '2022-11-28',
      'x-github-media-type': 'github.v3; format=json',
      'x-github-request-id': 'B297:11417:FD522C2:101929A7:63FCB92F',
      'x-oauth-scopes': 'gist, notifications, repo, workflow',
      'x-ratelimit-limit': '5000',
      'x-ratelimit-remaining': '4997',
      'x-ratelimit-reset': '1677510250',
      'x-ratelimit-resource': 'core',
      'x-ratelimit-used': '3',
      'x-xss-protection': '0',
    },
    data: {
      name: 'AWS_ACCESS_KEY',
      created_at: '2023-02-10T11:33:04Z',
      updated_at: '2023-02-14T12:26:30Z',
    },
  };

  const responseList: any = {
    status: 200,
    url: 'https://api.github.com/repos/ebiz-markusrissmann/mwaa-pitch/actions/secrets',
    headers: {
      'access-control-allow-origin': '*',
      'access-control-expose-headers':
        'ETag, Link, Location, Retry-After, X-GitHub-OTP, X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Used, X-RateLimit-Resource, X-RateLimit-Reset, X-OAuth-Scopes, X-Accepted-OAuth-Scopes, X-Poll-Interval, X-GitHub-Media-Type, X-GitHub-SSO, X-GitHub-Request-Id, Deprecation, Sunset',
      'cache-control': 'private, max-age=60, s-maxage=60',
      'content-encoding': 'gzip',
      'content-security-policy': "default-src 'none'",
      'content-type': 'application/json; charset=utf-8',
      date: 'Mon, 27 Feb 2023 14:04:10 GMT',
      etag: 'W/"a2ea2ca3f277013ac326a2e19c14785b0aa629f530d1a72ec082de35dc91562c"',
      'github-authentication-token-expiration': '2023-03-03 17:13:49 UTC',
      'referrer-policy': 'origin-when-cross-origin, strict-origin-when-cross-origin',
      server: 'GitHub.com',
      'strict-transport-security': 'max-age=31536000; includeSubdomains; preload',
      'transfer-encoding': 'chunked',
      vary: 'Accept, Authorization, Cookie, X-GitHub-OTP, Accept-Encoding, Accept, X-Requested-With',
      'x-accepted-oauth-scopes': '',
      'x-content-type-options': 'nosniff',
      'x-frame-options': 'deny',
      'x-github-api-version-selected': '2022-11-28',
      'x-github-media-type': 'github.v3; format=json',
      'x-github-request-id': 'B285:0699:1578675C:15D6AA86:63FCB85A',
      'x-oauth-scopes': 'gist, notifications, repo, workflow',
      'x-ratelimit-limit': '5000',
      'x-ratelimit-remaining': '4999',
      'x-ratelimit-reset': '1677510250',
      'x-ratelimit-resource': 'core',
      'x-ratelimit-used': '1',
      'x-xss-protection': '0',
    },
    data: {
      total_count: 2,
      secrets: [
        {
          name: 'AWS_ACCESS_KEY',
          created_at: '2023-02-10T11:33:04Z',
          updated_at: '2023-02-14T12:26:30Z',
        },
        {
          name: 'AWS_SECRET_KEY',
          created_at: '2023-02-10T11:33:24Z',
          updated_at: '2023-02-14T12:26:50Z',
        },
      ],
    },
  };

  beforeAll(() => {
    mockReset(octokitMock);
  });

  test('ListRepositorySecrets', async () => {
    const githubSecrets = new GithubSecrets(octokitMock);
    octokitMock.request.mockImplementation(() => Promise.resolve(responseList));

    const resp = await githubSecrets.ListRepositorySecrets('owner', 'repo');
    expect(resp).toEqual(responseList.data.secrets);
    expect(octokitMock.request).toBeCalledWith('GET /repos/{owner}/{repo}/actions/secrets', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, owner: 'owner', repo: 'repo' });
    expect(octokitMock.request).toBeCalledTimes(1);
  });

  test('Test GetRepositorySecret', async () => {
    const githubSecrets = new GithubSecrets(octokitMock);
    octokitMock.request.mockImplementation(() => Promise.resolve(responseGetSecret));

    const resp = await githubSecrets.GetRepositorySecret('owner', 'repo', 'AWS_ACCESS_KEY');
    expect(resp).toEqual(responseGetSecret.data);
    expect(octokitMock.request).toBeCalledWith('GET /repos/{owner}/{repo}/actions/secrets/{secret_name}', { headers: { 'X-GitHub-Api-Version': '2022-11-28' }, owner: 'owner', repo: 'repo', secret_name: 'AWS_ACCESS_KEY' });
  });

test('Test CreateOrUpdateSecret',async () => {
    //const githubSecrets = new GithubSecrets(octokitMock);   

})

});
