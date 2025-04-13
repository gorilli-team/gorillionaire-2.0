package events

import (
	"time"

	"github.com/gorilli/gorillionaire-2.0/database/gorillionairedb/model"
	proto "github.com/gorilli/gorillionaire-2.0/gen/v1/go/proto/v1/database"
	"github.com/nats-io/nats.go"
)

type Request struct {
	nc *nats.Conn `json:"nc"`
}

func NewRequest(nc *nats.Conn) *Request {
	return &Request{nc: nc}
}

func (r *Request) GetSignalList() (*[]*model.Signal, error) {
	msg, err := r.nc.Request("signals", []byte(""), time.Second*10)
	if err != nil {
		return nil, err
	}

	protoSignalList := &proto.SignalList{}
	err = proto.Unmarshal(msg.Data, protoSignalList)
	if err != nil {
		return nil, err
	}

	signalList := make([]*model.Signal, 0)
	err = proto.Unmarshal(msg.Data, &signalList)
	if err != nil {
		return nil, err
	}

	signals := make([]*model.Signal, 0)
	for _, subject := range signalList.Config.Subjects {
		signals = append(signals, &model.Signal{Name: subject})
	}
	return &signals, nil
}

type RequestList struct {
	Requests []Request `json:"requests"`
}

func (r *RequestList) AddRequest(request Request) {
	r.Requests = append(r.Requests, request)
}

func (r *RequestList) GetRequests() []Request {
	return r.Requests
}
