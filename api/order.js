export default async function handler(req,res){
  if(req.method!=="POST")
    return res.status(405).json({message:"Method tidak diizinkan"});

  const {cart}=req.body;

  if(!Array.isArray(cart)||!cart.length)
    return res.status(400).json({message:"Keranjang kosong"});

  const items=cart.map(item=>({
    id:String(item.id),
    name:item.name,
    price:Number(item.price),
    quantity:Number(item.qty)
  }));

  const total=items.reduce((sum,item)=>sum+item.price*item.quantity,0);
  const orderId=`ORDER-${Date.now()}`;

  try{
    const auth=Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString("base64");

    const response=await fetch(
      "https://app.sandbox.midtrans.com/snap/v1/transactions",
      {
        method:"POST",
        headers:{
          "Accept":"application/json",
          "Content-Type":"application/json",
          "Authorization":`Basic ${auth}`
        },
        body:JSON.stringify({
          transaction_details:{
            order_id:orderId,
            gross_amount:total
          },
          item_details:items
        })
      }
    );

    const data=await response.json();

    if(!response.ok)
      return res.status(response.status).json({
        status:"error",
        message:"Gagal membuat transaksi Midtrans",
        detail:data
      });

    res.status(200).json({
      status:"success",
      order_id:orderId,
      total,
      snap_token:data.token
    });

  }catch(error){
    console.error(error);
    res.status(500).json({
      status:"error",
      message:"Terjadi kesalahan server"
    });
  }
}
