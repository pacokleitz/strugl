package post

import (
	"strings"
	"unicode"
)

// Extract a slice of topics from the post content
func GetPostTopics(postContent string) []string {

	var postTopics []string

	postWords := strings.Split(postContent, " ")

	for _, word := range postWords {
		if topic, isTopic := IsTopic(word); isTopic {
			postTopics = append(postTopics, topic)
		}
	}

	return postTopics
}

// Check if a word is a hashtag returning a bool if it matched and the topic string
func IsTopic(w string) (string, bool) {

	wTrim := strings.TrimSpace(w)

	if wTrim[0] == '#' {
		for _, letter := range wTrim[1:] {
			if !unicode.IsLetter(letter) && !unicode.IsDigit(letter) {
				return "", false
			}
		}
		return wTrim[1:], true
	}
	return "", false
}
