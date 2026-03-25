/**
 * SOVEREIGN v9.1 - PAYMENT & TRANSACTION ORCHESTRATION
 * Handles Razorpay checkout and Supabase logging with dynamic Firestore key retrieval.
 */

const PaymentService = {
    razorpayKey: null,

    async init() {
        if (this.razorpayKey) return;
        try {
            const doc = await db.collection('admin').doc('settings').get();
            if (doc.exists) {
                this.razorpayKey = doc.data().RAZORPAY_KEY_ID;
                console.log("PAYMENT_SERVICE: Dynamic Key Loaded.");
            }
        } catch (e) {
            console.error("PAYMENT_SERVICE_INIT_ERROR:", e);
        }
    },

    async processCheckout(product) {
        await this.init();
        if (!this.razorpayKey) {
            alert("SYSTEM_OFFLINE: Payment keys not found.");
            return;
        }

        const options = {
            key: this.razorpayKey,
            amount: product.price * 100,
            currency: "INR",
            name: "TradeSovereign v9.1",
            description: `Unlock ${product.name}`,
            handler: (res) => this.recordTransaction(product, res),
            theme: { color: "#10b981" }
        };

        const rzp = new Razorpay(options);
        rzp.open();
    },

    async recordTransaction(product, response) {
        console.log("TX_SUCCESS:", response.razorpay_payment_id);
        
        // Log to Supabase for high-authority transaction tracking
        try {
            const { data, error } = await supabase
                .from('purchases')
                .insert([{
                    item_id: product.id,
                    tx_id: response.razorpay_payment_id,
                    status: 'completed',
                    timestamp: new Date().toISOString()
                }]);

            if (data) alert(`ACCESS_GRANTED: ${product.name} unlocked.`);
        } catch (e) {
            console.error("TX_LOG_ERROR:", e);
        }
    }
};
