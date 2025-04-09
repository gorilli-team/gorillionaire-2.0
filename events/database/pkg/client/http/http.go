package httpclient

import (
	"context"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"

	"github.com/rs/zerolog/log"
	"golang.org/x/time/rate"
)

type HTTPClient struct {
	url     string
	client  *http.Client
	limiter *rate.Limiter
}

func NewHTTPClient(url string) *HTTPClient {
	return &HTTPClient{
		url:     url,
		client:  &http.Client{},
		limiter: rate.NewLimiter(rate.Every(100*time.Millisecond), 1),
	}
}

func (h *HTTPClient) doPost(reqURL string, values url.Values, headers map[string]string) ([]byte, error) {
	log.Debug().Msgf("Making POST request to %s", reqURL)
	// Create request
	req, err := http.NewRequest("POST", reqURL, strings.NewReader(values.Encode()))
	if err != nil {
		return nil, fmt.Errorf("could not execute request! #1 (%s) on %s", err.Error(), reqURL)
	}

	return h.request(req, headers)
}

func (h *HTTPClient) doGet(reqURL string, headers map[string]string) ([]byte, error) {
	log.Debug().Msgf("Making GET request to %s", reqURL)
	// Create request
	req, err := http.NewRequest("GET", reqURL, nil)
	if err != nil {
		return nil, fmt.Errorf("could not execute request! #1 (%s) on %s", err.Error(), reqURL)
	}

	return h.request(req, headers)
}

func (h *HTTPClient) request(req *http.Request, headers map[string]string) ([]byte, error) {
	h.limiter.Wait(context.Background())
	for key, value := range headers {
		log.Debug().Msgf("Setting header %s: %s", key, value)
		req.Header.Add(key, value)
	}

	res, err := h.client.Do(req)
	if err != nil {
		return nil, err
	}
	defer res.Body.Close()

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return nil, err
	}

	return body, nil
}

func (h *HTTPClient) Post(uri string, values url.Values, headers map[string]string) ([]byte, error) {
	reqURL := fmt.Sprintf("%s%s", h.url, uri)
	log.Printf("Making private API request to %s\n", reqURL)
	resp, err := h.doPost(reqURL, values, headers)
	return resp, err
}

func (h *HTTPClient) Get(uri string, values url.Values, headers map[string]string) ([]byte, error) {
	reqURL := fmt.Sprintf("%s%s", h.url, uri)
	log.Printf("Making private API request to %s\n", reqURL)

	resp, err := h.doGet(reqURL, headers)
	return resp, err
}
