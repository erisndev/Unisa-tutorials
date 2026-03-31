import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { PaymentAPI } from "../api/payments";
import { PageTransition, FadeIn } from "../components/motion";

function useQuery() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export default function PaymentSuccessPage() {
  const query = useQuery();
  const navigate = useNavigate();

  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("Verifying payment...");

  const reference = query.get("reference") || query.get("trxref") || "";

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!reference) {
        setStatus("error");
        setMessage("Missing payment reference.");
        return;
      }

      try {
        const res = await PaymentAPI.verify(reference);
        if (cancelled) return;

        if (res?.success) {
          setStatus("success");
          setMessage("Payment verified. Redirecting...");

          // Clear local drafts
          window.localStorage.removeItem("booking_draft_v1");
          window.localStorage.removeItem("payment_draft_v1");

          // Redirect to booking success screen
          navigate("/book?success=1", { replace: true });
        } else {
          setStatus("error");
          setMessage(res?.message || "Payment verification failed.");
        }
      } catch (e) {
        if (cancelled) return;
        setStatus("error");
        setMessage(e?.response?.data?.message || e?.message || "Payment verification failed.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reference, navigate]);

  return (
    <PageTransition>
      <section className="section">
        <div className="container">
          <FadeIn>
            <div className="card p-8 max-w-xl mx-auto text-center">
              <h1 className="text-2xl font-bold">Payment Status</h1>
              <p className="mt-3 text-muted-foreground">{message}</p>

              {status === "error" && (
                <div className="mt-6 flex justify-center">
                  <button
                    className="btn-primary"
                    onClick={() => navigate("/book", { replace: true })}
                    type="button"
                  >
                    Back to booking
                  </button>
                </div>
              )}
            </div>
          </FadeIn>
        </div>
      </section>
    </PageTransition>
  );
}
