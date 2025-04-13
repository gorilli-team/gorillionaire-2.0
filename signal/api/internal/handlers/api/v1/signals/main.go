package signals

import (
	"strconv"

	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/model"
	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/query"
	"github.com/gorilli/gorillionaire-2.0/signal/api/commons"

	"github.com/gin-gonic/gin"
	"github.com/rs/zerolog/log"
)

func Signals(c *gin.Context) {
	qrInterface, exist := c.Get("qr")

	if !exist {
		log.Error().Msg("Failed to get ingestor interface")
		c.JSON(commons.StatusInternalServerError, gin.H{
			"message": commons.InternalServerError,
		})
		return
	}
	queryLimit := c.Query("limit")
	var limit int = 25
	if queryLimit != "" {
		var err error
		limit, err = strconv.Atoi(queryLimit)
		if err != nil {
			log.Error().Msgf("Failed to convert limit to int %v", err)
		}
	}
	qr := qrInterface.(*query.Query)
	active := true
	query := &model.SignalQuery{
		Active: &active,
		Limit:  &limit,
	}
	channels, err := qr.GetSignals(query)
	if err != nil {
		log.Error().Msgf("Failed to get signals %v", err)
		c.JSON(commons.StatusInternalServerError, gin.H{
			"message": commons.InternalServerError,
		})
		return
	}
	c.Header("Content-Type", "application/json")
	c.JSON(commons.StatusOK, gin.H{
		"channels": channels,
	})

}
