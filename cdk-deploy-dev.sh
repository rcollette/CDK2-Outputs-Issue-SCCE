VERSION=${1:-${VERSION:-"latest"}}
cdk deploy -c environment=dev -c docker-image-version=${VERSION} "*"
