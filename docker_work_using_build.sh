#!/bin/bash
if [ -z "$1" ]
  then
    TAG="haiqv/oasis-frontend-admin:latest"
  else
    TAG="$1"
fi
echo "Tag: $TAG"
npm run build
docker build -t $TAG -f Dockerfile_using_dist . --platform linux/amd64
docker push $TAG
kubectl set image deploy oasis-frontend-admin oasis-frontend-admin=$TAG -n haiqv --kubeconfig /Users/choejieun/.kube/config_oasis.yaml
kubectl rollout restart deployment oasis-frontend-admin -n haiqv --kubeconfig /Users/choejieun/.kube/config_oasis.yaml
echo '.'
echo '=== Done ==='