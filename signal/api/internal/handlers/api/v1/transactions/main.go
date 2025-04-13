package transactions

import (
	"database/timeseries/models"
	"timeseries/commons"
	"timeseries/internal/ingestor"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

func AddTranaction(c *gin.Context) {
	ingestorInterface, exist := c.Get("ingestor")

	if !exist {
		log.Error().Msg("Failed to get ingestor interface")
		c.JSON(commons.StatusInternalServerError, gin.H{
			"message": commons.InternalServerError,
		})
		return
	}

	ingest := ingestorInterface.(*ingestor.Ingestor)
	transaction := models.Transaction{}
	ingest.PushTransaction(&transaction)
	c.JSON(commons.StatusOK, gin.H{
		"message": "Transaction added successfully",
	})

}
