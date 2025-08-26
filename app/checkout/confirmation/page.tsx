export default async function ConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;

  return (
    <div
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        paddingTop: "120px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "#0ff",
      }}
    >
      <div
        style={{
          backgroundColor: "#000",
          borderRadius: "1.5rem",
          padding: "2rem",
          width: "100%",
          maxWidth: 560,
          boxShadow: "0 0 15px rgba(0,255,255,.25)",
          border: "1px solid rgba(0,255,255,.35)",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Ευχαριστούμε!</h1>
        <p style={{ color: "#9ef" }}>
          Η παραγγελία σου καταχωρήθηκε επιτυχώς.
        </p>
        {id && (
          <p style={{ marginTop: 8, color: "#aef" }}>
            Κωδικός παραγγελίας: <b>#{id.slice(0, 8).toUpperCase()}</b>
          </p>
        )}
      </div>
    </div>
  );
}
