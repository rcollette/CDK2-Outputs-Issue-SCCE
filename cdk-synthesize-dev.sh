VERSION=${1:-${VERSION:-"latest"}}
cdk synthesize -c environment=dev -c docker-image-version=${VERSION} "*"
