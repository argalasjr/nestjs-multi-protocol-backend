#!/bin/bash

PROTO_DIR=./proto
mkdir proto/generated
PROTO_DIR_GEN=proto/generated

grpc_tools_node_protoc \
    --plugin=protoc-gen-ts=./node_modules/.bin/protoc-gen-ts_proto \
    --ts_out=${PROTO_DIR_GEN} \
    -I ./proto \
    proto/*.proto

grpc_tools_node_protoc \
  --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin \
  --ts_out=grpc_js:${PROTO_DIR_GEN} \
  --js_out=import_style=commonjs:${PROTO_DIR_GEN} \
  --grpc_out=grpc_js:${PROTO_DIR_GEN} \
  -I ./proto \
  proto/*.proto