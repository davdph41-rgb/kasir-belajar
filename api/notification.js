import crypto from "crypto";

export default async function handler(req,res){
  if(req.method!=="POST")
    return res.status(405).json({message:"Method tidak diizinkan"});

  try{
    const {
      order_id,
      status_code,
      gross_amount,
      signature_key,
      transaction_status,
      fraud_status,
      payment_type
    }=req.body;

    const signature=crypto
      .createHash("sha512")
      .update(
        order_id+
        status_code+
        gross_amount+
        process.env.MIDTRANS_SERVER_KEY
      )
      .digest("hex");

    if(signature!==signature_key)
      return res.status(401).json({message:"Signature tidak valid"});

    console.log("=== MIDTRANS NOTIFICATION ===");
    console.log("Order ID:",order_id);
    console.log("Status:",transaction_status);
    console.log("Payment:",payment_type);
    console.log("Amount:",gross_amount);
    console.log("Fraud:",fraud_status||"-");

    res.status(200).json({
      status:"success",
      order_id,
      transaction_status
    });

  }catch(error){
    console.error(error);
    res.status(500).json({message:"Webhook error"});
  }
}
