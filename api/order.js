export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method tidak diizinkan" });
  }

  const { product, price, qty } = req.body;

  if (!product || !price || !qty) {
    return res.status(400).json({ message: "Data belum lengkap" });
  }

  const total = Number(price) * Number(qty);

  res.status(200).json({
    status: "success",
    product,
    qty,
    total
  });
}
