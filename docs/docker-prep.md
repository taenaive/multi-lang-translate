```sh
brew install colima
brew services start colima
brew install docker
colima start
brew install docker-credential-helper
echo YOUR_GITHUB_TOKEN | docker login ghcr.io -u YOUR_USER_NAME --password-stdin

```