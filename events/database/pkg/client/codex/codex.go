package codex

import (
	"net/url"
	"strings"

	"github.com/gorilli/gorillionaire-2.0/events/database/pkg/client/http"
	"github.com/gorilli/gorillionaire-2.0/events/database/pkg/utils"
)

type CodexClient struct {
	url    string
	apiKey string
	http   *httpclient.HTTPClient
}

func NewCodexClient(url string) *CodexClient {
	return &CodexClient{
		url:    utils.GetEnvOrDefault("CODEX_URL", "https://graph.codex.io"),
		apiKey: utils.GetEnvOrDefault("CODEX_API_KEY", ""),
		http:   httpclient.NewHTTPClient(url),
	}
}

func (c *CodexClient) GetTokenInfo(tokenAddresses []string) (*model.TokenInfo, error) {
	headers := c.getHeaders()
	var sb strings.Builder
	sb.WriteString(`query { ids([`)
	for i, address := range tokenAddresses {
		if i > 0 {
			sb.WriteString(", ")
		}
		sb.WriteString(`{"address": "` + address + `", "networkId": "1"}`)
	}
	sb.WriteString(`]) }`)
	query := sb.String()
	values := url.Values{}
	values.Add("query", query)
	body, err := c.http.Post("/graphql", values, headers)
	if err != nil {
		return nil, err
	}

	return nil, nil
}

func (c *CodexClient) getHeaders() map[string]string {
	headers := map[string]string{
		"Authorization": c.apiKey,
		"Content-Type":  "application/json",
		"Accept":        "application/json",
	}

	return headers
}
