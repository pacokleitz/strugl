package sqlbulk

import (
	"fmt"
	"strings"
)

// Make bulk inserting possible without having to query DB multiple times
// Create sql statement string inserting all topics at once (Batch Insert)
func GetBulkTopicsStatement(post_id int64, topics []string) (string, []interface{}) {

	valueStrings := make([]string, 0, len(topics))
	valueArgs := make([]interface{}, 0, len(topics)*2)
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