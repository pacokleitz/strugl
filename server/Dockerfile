
FROM golang

WORKDIR /app

COPY go.mod /app
COPY go.sum /app

RUN go mod download

COPY . /app

RUN go build -o main ./cmd/server

CMD ["/app/main"]

EXPOSE 8080