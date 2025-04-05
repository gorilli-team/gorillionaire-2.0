// Code generated by protoc-gen-go. DO NOT EDIT.
// versions:
// 	protoc-gen-go v1.36.6
// 	protoc        v3.20.3
// source: v1/envio/envio.proto

package envio

import (
	protoreflect "google.golang.org/protobuf/reflect/protoreflect"
	protoimpl "google.golang.org/protobuf/runtime/protoimpl"
	reflect "reflect"
	sync "sync"
	unsafe "unsafe"
)

const (
	// Verify that this generated code is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(20 - protoimpl.MinVersion)
	// Verify that runtime/protoimpl is sufficiently up-to-date.
	_ = protoimpl.EnforceVersion(protoimpl.MaxVersion - 20)
)

// EnvioPriceEvent contains the price event details
type EnvioPriceEvent struct {
	state             protoimpl.MessageState `protogen:"open.v1"`
	FromAddress       string                 `protobuf:"bytes,1,opt,name=FromAddress,proto3" json:"FromAddress,omitempty"`
	ToAddress         string                 `protobuf:"bytes,2,opt,name=ToAddress,proto3" json:"ToAddress,omitempty"`
	Amount            string                 `protobuf:"bytes,3,opt,name=Amount,proto3" json:"Amount,omitempty"`
	BlockNumber       string                 `protobuf:"bytes,4,opt,name=BlockNumber,proto3" json:"BlockNumber,omitempty"`
	BlockTimestamp    string                 `protobuf:"bytes,5,opt,name=BlockTimestamp,proto3" json:"BlockTimestamp,omitempty"`
	TransactionHash   string                 `protobuf:"bytes,6,opt,name=TransactionHash,proto3" json:"TransactionHash,omitempty"`
	TokenSymbol       string                 `protobuf:"bytes,7,opt,name=TokenSymbol,proto3" json:"TokenSymbol,omitempty"`
	TokenName         string                 `protobuf:"bytes,8,opt,name=TokenName,proto3" json:"TokenName,omitempty"`
	TokenAddress      string                 `protobuf:"bytes,9,opt,name=TokenAddress,proto3" json:"TokenAddress,omitempty"`
	TokenDecimals     int32                  `protobuf:"varint,10,opt,name=TokenDecimals,proto3" json:"TokenDecimals,omitempty"`
	ThisHourTransfers int32                  `protobuf:"varint,11,opt,name=ThisHourTransfers,proto3" json:"ThisHourTransfers,omitempty"`
	unknownFields     protoimpl.UnknownFields
	sizeCache         protoimpl.SizeCache
}

func (x *EnvioPriceEvent) Reset() {
	*x = EnvioPriceEvent{}
	mi := &file_v1_envio_envio_proto_msgTypes[0]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *EnvioPriceEvent) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*EnvioPriceEvent) ProtoMessage() {}

func (x *EnvioPriceEvent) ProtoReflect() protoreflect.Message {
	mi := &file_v1_envio_envio_proto_msgTypes[0]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use EnvioPriceEvent.ProtoReflect.Descriptor instead.
func (*EnvioPriceEvent) Descriptor() ([]byte, []int) {
	return file_v1_envio_envio_proto_rawDescGZIP(), []int{0}
}

func (x *EnvioPriceEvent) GetFromAddress() string {
	if x != nil {
		return x.FromAddress
	}
	return ""
}

func (x *EnvioPriceEvent) GetToAddress() string {
	if x != nil {
		return x.ToAddress
	}
	return ""
}

func (x *EnvioPriceEvent) GetAmount() string {
	if x != nil {
		return x.Amount
	}
	return ""
}

func (x *EnvioPriceEvent) GetBlockNumber() string {
	if x != nil {
		return x.BlockNumber
	}
	return ""
}

func (x *EnvioPriceEvent) GetBlockTimestamp() string {
	if x != nil {
		return x.BlockTimestamp
	}
	return ""
}

func (x *EnvioPriceEvent) GetTransactionHash() string {
	if x != nil {
		return x.TransactionHash
	}
	return ""
}

func (x *EnvioPriceEvent) GetTokenSymbol() string {
	if x != nil {
		return x.TokenSymbol
	}
	return ""
}

func (x *EnvioPriceEvent) GetTokenName() string {
	if x != nil {
		return x.TokenName
	}
	return ""
}

func (x *EnvioPriceEvent) GetTokenAddress() string {
	if x != nil {
		return x.TokenAddress
	}
	return ""
}

func (x *EnvioPriceEvent) GetTokenDecimals() int32 {
	if x != nil {
		return x.TokenDecimals
	}
	return 0
}

func (x *EnvioPriceEvent) GetThisHourTransfers() int32 {
	if x != nil {
		return x.ThisHourTransfers
	}
	return 0
}

// EnvioNewPair contains the new pair details
type EnvioNewPair struct {
	state         protoimpl.MessageState `protogen:"open.v1"`
	Token0Address string                 `protobuf:"bytes,1,opt,name=Token0Address,proto3" json:"Token0Address,omitempty"`
	Token1Address string                 `protobuf:"bytes,2,opt,name=Token1Address,proto3" json:"Token1Address,omitempty"`
	unknownFields protoimpl.UnknownFields
	sizeCache     protoimpl.SizeCache
}

func (x *EnvioNewPair) Reset() {
	*x = EnvioNewPair{}
	mi := &file_v1_envio_envio_proto_msgTypes[1]
	ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
	ms.StoreMessageInfo(mi)
}

func (x *EnvioNewPair) String() string {
	return protoimpl.X.MessageStringOf(x)
}

func (*EnvioNewPair) ProtoMessage() {}

func (x *EnvioNewPair) ProtoReflect() protoreflect.Message {
	mi := &file_v1_envio_envio_proto_msgTypes[1]
	if x != nil {
		ms := protoimpl.X.MessageStateOf(protoimpl.Pointer(x))
		if ms.LoadMessageInfo() == nil {
			ms.StoreMessageInfo(mi)
		}
		return ms
	}
	return mi.MessageOf(x)
}

// Deprecated: Use EnvioNewPair.ProtoReflect.Descriptor instead.
func (*EnvioNewPair) Descriptor() ([]byte, []int) {
	return file_v1_envio_envio_proto_rawDescGZIP(), []int{1}
}

func (x *EnvioNewPair) GetToken0Address() string {
	if x != nil {
		return x.Token0Address
	}
	return ""
}

func (x *EnvioNewPair) GetToken1Address() string {
	if x != nil {
		return x.Token1Address
	}
	return ""
}

var File_v1_envio_envio_proto protoreflect.FileDescriptor

const file_v1_envio_envio_proto_rawDesc = "" +
	"\n" +
	"\x14v1/envio/envio.proto\x12\x05proto\"\x95\x03\n" +
	"\x0fEnvioPriceEvent\x12 \n" +
	"\vFromAddress\x18\x01 \x01(\tR\vFromAddress\x12\x1c\n" +
	"\tToAddress\x18\x02 \x01(\tR\tToAddress\x12\x16\n" +
	"\x06Amount\x18\x03 \x01(\tR\x06Amount\x12 \n" +
	"\vBlockNumber\x18\x04 \x01(\tR\vBlockNumber\x12&\n" +
	"\x0eBlockTimestamp\x18\x05 \x01(\tR\x0eBlockTimestamp\x12(\n" +
	"\x0fTransactionHash\x18\x06 \x01(\tR\x0fTransactionHash\x12 \n" +
	"\vTokenSymbol\x18\a \x01(\tR\vTokenSymbol\x12\x1c\n" +
	"\tTokenName\x18\b \x01(\tR\tTokenName\x12\"\n" +
	"\fTokenAddress\x18\t \x01(\tR\fTokenAddress\x12$\n" +
	"\rTokenDecimals\x18\n" +
	" \x01(\x05R\rTokenDecimals\x12,\n" +
	"\x11ThisHourTransfers\x18\v \x01(\x05R\x11ThisHourTransfers\"Z\n" +
	"\fEnvioNewPair\x12$\n" +
	"\rToken0Address\x18\x01 \x01(\tR\rToken0Address\x12$\n" +
	"\rToken1Address\x18\x02 \x01(\tR\rToken1AddressB<Z:github.com/gorilli/gorillionaire-2.0/gen/v1/go/proto/enviob\x06proto3"

var (
	file_v1_envio_envio_proto_rawDescOnce sync.Once
	file_v1_envio_envio_proto_rawDescData []byte
)

func file_v1_envio_envio_proto_rawDescGZIP() []byte {
	file_v1_envio_envio_proto_rawDescOnce.Do(func() {
		file_v1_envio_envio_proto_rawDescData = protoimpl.X.CompressGZIP(unsafe.Slice(unsafe.StringData(file_v1_envio_envio_proto_rawDesc), len(file_v1_envio_envio_proto_rawDesc)))
	})
	return file_v1_envio_envio_proto_rawDescData
}

var file_v1_envio_envio_proto_msgTypes = make([]protoimpl.MessageInfo, 2)
var file_v1_envio_envio_proto_goTypes = []any{
	(*EnvioPriceEvent)(nil), // 0: proto.EnvioPriceEvent
	(*EnvioNewPair)(nil),    // 1: proto.EnvioNewPair
}
var file_v1_envio_envio_proto_depIdxs = []int32{
	0, // [0:0] is the sub-list for method output_type
	0, // [0:0] is the sub-list for method input_type
	0, // [0:0] is the sub-list for extension type_name
	0, // [0:0] is the sub-list for extension extendee
	0, // [0:0] is the sub-list for field type_name
}

func init() { file_v1_envio_envio_proto_init() }
func file_v1_envio_envio_proto_init() {
	if File_v1_envio_envio_proto != nil {
		return
	}
	type x struct{}
	out := protoimpl.TypeBuilder{
		File: protoimpl.DescBuilder{
			GoPackagePath: reflect.TypeOf(x{}).PkgPath(),
			RawDescriptor: unsafe.Slice(unsafe.StringData(file_v1_envio_envio_proto_rawDesc), len(file_v1_envio_envio_proto_rawDesc)),
			NumEnums:      0,
			NumMessages:   2,
			NumExtensions: 0,
			NumServices:   0,
		},
		GoTypes:           file_v1_envio_envio_proto_goTypes,
		DependencyIndexes: file_v1_envio_envio_proto_depIdxs,
		MessageInfos:      file_v1_envio_envio_proto_msgTypes,
	}.Build()
	File_v1_envio_envio_proto = out.File
	file_v1_envio_envio_proto_goTypes = nil
	file_v1_envio_envio_proto_depIdxs = nil
}
