/**
 * SOVEREIGN v9.2 - PAYMENT NEXUS
 * Handles Razorpay checkout and Supabase transaction logging.
 */

const PaymentNexus = {
    razorpayKey: null,

    async init() {
        if (this.razorpayKey) return;
        try {
            const doc = await db.collection('admin').doc('settings').get();
            if (doc.exists) {
                this.razorpayKey = doc.data().RAZORPAY_KEY_ID;
                console.log("PAYMENT_NEXUS: Dynamic Cloud-Key Loaded.");
            }
        } catch (e) {
            console.error("PAYMENT_INIT_ERROR:", e);
        }
    },

    async checkout(product) {
        await this.init();
        if (!this.razorpayKey) {
            alert("SYSTEM_OFFLINE: Payment keys unavailable.");
            return;
        }

        const options = {
            key: this.razorpayKey,
            amount: product.price * 100,
            currency: "INR",
            name: "TradeSovereign v9.2",
            description: `Unlocking ${product.name}`,
            handler: (res) => this.record(product, res),
            theme: { color: "#10b981" }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    },

    async record(product, response) {
        console.log("TX_SUCCESS:", response.razorpay_payment_id);
        
        try {
            const { data, error } = await supabase
                .from('purchases')
                .insert([{
                    item_id: product.id,
                    tx_id: response.razorpay_payment_id,
                    status: 'completed',
                    timestamp: new Date().toISOString()
                }]);

            if (!error) alert(`ACCESS_GRANTED: ${product.name} is now in your Vault.`);
        } catch (e) {
            console.error("TX_LOG_FAIL:", e);
        }
    }
};
