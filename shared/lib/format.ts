const rentalFeeFormatter = new Intl.NumberFormat("ko-KR");

const FEE_UNIT_LABELS = {
	HOUR: "시간",
	DAY: "일",
} as const;

type FeeUnit = keyof typeof FEE_UNIT_LABELS;

export function formatRentalFeeLabel(rentalFee: number, feeUnit: FeeUnit) {
	if (rentalFee === 0) {
		return "무료 대여";
	}

	return `${rentalFeeFormatter.format(rentalFee)}원 / ${FEE_UNIT_LABELS[feeUnit]}`;
}
