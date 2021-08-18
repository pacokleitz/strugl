# Build in 
FROM golang AS builder

WORKDIR /app

COPY go.mod /app
COPY go.sum /app

RUN go mod download

COPY . /app

RUN CGO_ENABLED=0 GOOS=linux go build -o main ./cmd/server

# Make another lightweight image copying only the binary
FROM alpine:latest AS production

WORKDIR /app

COPY --from=builder /app .

CMD ["/app/main"]

EXPOSE 8080