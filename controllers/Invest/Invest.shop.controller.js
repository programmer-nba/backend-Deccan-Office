const axios = require('axios');

module.exports.getInvestAll = async (req, res) => {
	try {
		const resp = await axios.get(`${process.env.URL_TOSSAGUN}/partner/invest`, {
			headers: {
				'Accept': 'application/json',
			}
		});
		if (resp.data.status) {
			return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: resp.data.data })
		} else {
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลไม่สำเร็จ' })
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.getInvestById = async (req, res) => {
	try {
		const id = req.params.id;
		const resp = await axios.get(`${process.env.URL_TOSSAGUN}/partner/invest/${id}`, {
			headers: {
				'Accept': 'application/json',
			}
		});
		if (resp.data.status) {
			return res.status(200).send({ status: true, message: 'ดึงข้อมูลสำเร็จ', data: resp.data.data })
		} else {
			return res.status(403).send({ status: false, message: 'ดึงข้อมูลไม่สำเร็จ' })
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.approve = async (req, res) => {
	try {
		const id = req.params.id;
		const value = {
			employee: req.decoded.id,
		};
		const resp = await axios.post(`${process.env.URL_TOSSAGUN}/partner/invest/approve/${id}`, value, {
			headers: {
				'Accept': 'application/json',
			}
		});
		if (resp.data.status) {
			return res.status(200).send({ status: true, message: 'อนุมัติผู้ลงทุนสำเร็จ' })
		} else {
			return res.status(403).send({ status: false, message: 'อนุมัติผู้ลงทุนไม่สำเร็จ' })
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};

module.exports.cancel = async (req, res) => {
	try {
		const id = req.params.id;
		const resp = await axios.post(`${process.env.URL_TOSSAGUN}/partner/invest/cancel/${id}`, {
			headers: {
				'Accept': 'application/json',
			}
		});
		if (resp.data.status) {
			return res.status(200).send({ status: true, message: 'ไม่อนุมัติผู้ลงทุนสำเร็จ' })
		} else {
			return res.status(403).send({ status: false, message: 'ไม่อนุมัติผู้ลงทุนไม่สำเร็จ' })
		}
	} catch (error) {
		console.error(error);
		return res.status(500).send({ message: "Internal Server Error" });
	}
};