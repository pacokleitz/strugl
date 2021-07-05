package sqlbulk

import (
	"fmt"
	"strings"
)

// Make bulk inserting possible without having to query DB multiple times
// Create sql statement string inserting all topics at once (Batch Insert)
func GetBulkPostsTopicsStatement(post_id int64, topics []string) (string, []interface{}) {

	lentopics := len(topics)

	valueStrings := make([]string, 0, lentopics)
	valueArgs := make([]interface{}, 0, lentopics*2)
	i := 1

	for _, topic := range topics {
		valueString := fmt.Sprintf("($%d, $%d)", i, i+1)
		valueStrings = append(valueStrings, valueString)
		valueArgs = append(valueArgs, post_id)
		valueArgs = append(valueArgs, topic)
		i += 2
	}
	return strings.Join(valueStrings, ","), valueArgs
}

// Return a postgres insert statement
func GetBulkInsertStatement(length int) (string) {

	valueStrings := make([]string, 0, length)

	for i := 1; i <= length; i++ {
		valueString := fmt.Sprintf("$%d", i)
		valueStrings = append(valueStrings, valueString)
	}
	return strings.Join(valueStrings, ",")
}