
FROM golang

COPY . /go/src/strugl
WORKDIR /go/src/strugl

RUN go install strugl

ENTRYPOINT /go/bin/strugl

EXPOSE 8080