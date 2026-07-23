module github.com/edaos-foundation/edaos-sdk-go

go 1.22

require (
	github.com/google/uuid         v1.6.0
	golang.org/x/crypto            v0.24.0
	go.opentelemetry.io/otel       v1.28.0
	go.opentelemetry.io/otel/trace v1.28.0
)

// EDAOS SDK — Go module manifest
// Install: go get github.com/edaos-foundation/edaos-sdk-go
//
// Usage:
//
//   import "github.com/edaos-foundation/edaos-sdk-go/edaos"
//
//   client := edaos.New("my-agent")
//   ev, _ := client.Observe("LCP", 3800, "ms", nil)
//   if ev.Fails() {
//       result, _ := client.Execute("optimize_lcp", ev, action, rollback)
//   }
