/* 
  SOVEREIGN v12.0 - PAYMENT NEXUS (RAZORPAY + SUPABASE)
  Institutional FinOps Orchestration
*/

import { db } from './firebase-config.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

class PaymentNexus {
    constructor() {
        this.razorpayKey = null;
        this.init();
    }

    async init() {
        const settings = await getDoc(doc(db, "admin", "settings"));
        if (settings.exists()) {
            this.razorpayKey = settings.data().razorpayKey;
        }
    }

    async startCheckout(amount, itemName) {
        if (!this.razorpayKey) {
            alert("Payment Nexus Offline: Orchestration Failure.");
            return;
        }

        const options = {
            key: this.razorpayKey,
            amount: amount * 100, // Convert to Paisa
            currency: "INR",
            name: "SOVEREIGN v12.0",
            description: `Provisioning: ${itemName}`,
            theme: { color: "#d4af37" },
            handler: (response) => this.handleSuccess(response, itemName, amount)
        };

        const rzp = new Razorpay(options);
        rzp.open();
    }

    async handleSuccess(response, itemName, amount) {
        console.log("[FINOPS]: Transaction Validated.", response);
        // Sync with Supabase for persistent transaction history
        try {
            const { error } = await supabase
                .from('transactions')
                .insert([{ 
                    payment_id: response.razorpay_payment_id,
                    asset: itemName,
                    value: amount,
                    status: 'PROVISIONED'
                }]);
            
            if (error) throw error;
            alert(`Sovereign Asset Provisioned: ${itemName}`);
            window.location.reload();
        } catch (e) {
            console.error("[FINOPS]: Vault Sync Failure.", e);
        }
    }
}

const nexus = new PaymentNexus();
export default nexus;
window.initiatePayment = (a, n) => nexus.startCheckout(a, n);
