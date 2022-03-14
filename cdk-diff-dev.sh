VERSION=${1:-${VERSION:-"latest"}}
cdk diff -c environment=dev -c docker-image-version=${VERSION} "*"
