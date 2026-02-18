import { ProofFlow } from "@/components/build-track/ProofFlow";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Final Proof | AI Resume Builder",
    description: "Final submission page for the build track.",
};

export default function ProofPage() {
    return <ProofFlow />;
}
