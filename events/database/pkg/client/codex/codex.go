package codex

import (
	"bytes"
	"encoding/json"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/model"
	httpclient "github.com/gorilli/gorillionaire-2.0/events/database/pkg/client/http"
	"github.com/gorilli/gorillionaire-2.0/events/database/pkg/utils"
)

type CodexClient struct {
	url    string
	apiKey string
	http   *httpclient.HTTPClient
}

func NewCodexClient() *CodexClient {
	url := utils.GetEnvOrDefault("CODEX_URL", "https://graph.codex.io")
	apiKey := utils.GetEnvOrDefault("CODEX_API_KEY", "")
	return &CodexClient{
		url:    url,
		apiKey: apiKey,
		http:   httpclient.NewHTTPClient(url),
	}
}

func (c *CodexClient) GetTokensInfo(tokenAddresses []string, chainId int32) (map[string]*model.Currency, error) {
	headers := c.getHeaders()
	var sb strings.Builder
	sb.WriteString(`query { tokens( ids: [`)
	for i, address := range tokenAddresses {
		if i > 0 {
			sb.WriteString(", ")
		}
		sb.WriteString(`{address: "` + address + `", networkId: ` + strconv.Itoa(int(chainId)) + `}`)
	}
	sb.WriteString(`]) { id symbol name decimals isScam networkId creatorAddress info { cmcId imageBannerUrl totalSupply description circulatingSupply } } }`)
	query := sb.String()
	fmt.Println(query)
	bodyMap := map[string]string{"query": query}
	jsonBody, err := json.Marshal(bodyMap)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal body: %w", err)
	}
	body, err := c.http.QueryPost("/graphql", bytes.NewReader(jsonBody), headers)
	if err != nil {
		return nil, err
	}
	var response map[string]interface{}
	json.Unmarshal(body, &response)
	fmt.Println(response)
	tokenInfoMap := make(map[string]*model.Currency)
	for _, token := range response["data"].(map[string]interface{})["tokens"].([]interface{}) {
		tokenMap := token.(map[string]interface{})
		tokenAddress := tokenMap["address"].(string)
		tokenInfo := tokenMap["info"].(map[string]interface{})
		tokenDecimals := tokenMap["decimals"].(int)
		tokenInfoMap[tokenAddress] = &model.Currency{
			Address:           tokenAddress,
			Decimals:          tokenDecimals,
			Symbol:            tokenInfo["symbol"].(string),
			Name:              tokenInfo["name"].(string),
			ImageBannerURL:    tokenInfo["imageBannerUrl"].(string),
			TotalSupply:       tokenInfo["totalSupply"].(float64),
			Description:       tokenInfo["description"].(string),
			CirculatingSupply: tokenInfo["circulatingSupply"].(float64),
			IsScam:            tokenMap["isScam"].(bool),
			ChainId:           tokenMap["networkId"].(int),
			CodexID:           tokenMap["id"].(string),
			CmcID:             tokenInfo["cmcId"].(string),
			CreatorAddress:    tokenInfo["creatorAddress"].(string),
			CreationDate:      tokenInfo["creationDate"].(time.Time),
			LaunchDate:        tokenInfo["launchDate"].(time.Time),
		}
	}
	return tokenInfoMap, nil
}

func (c *CodexClient) getHeaders() map[string]string {
	headers := map[string]string{
		"Authorization": c.apiKey,
		"Content-Type":  "application/json",
		"Accept":        "application/json",
	}

	return headers
}
