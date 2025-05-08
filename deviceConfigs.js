// Bu dosya otomatik olarak oluşturulmuştur. Lütfen manuel olarak düzenlemeyin.
// Son güncelleme: 2025-05-07T10:35:48.323Z

const deviceConfigs = {
  "Burdur": {
    "Efor4": {
      "analizor": [
        {
          "name": "Power_factor;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "Reactive_energy_ind;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "Reactive_energy_cap;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "H02_Meas_Q1;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "H02_Meas_Q3;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "H02_Meas_Q4;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "H02_Meas_Q2;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "Voltage_L1;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "Voltage_L2;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "Voltage_L3;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "Voltage_L12;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "Voltage_L23;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "Voltage_L31;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "Current_L1;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "Current_L2;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "Current_L3;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "H02_Meas_P;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "H02_Meas_Q;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "Frequency;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "H02_Meas_Wp_Imp;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "H02_Meas_Wp_Exp",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        }
      ],
      "inverter": [
        {
          "name": "active_power",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 0
        },
        {
          "name": "total_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 1
        },
        {
          "name": "major_alarm",
          "type": "UINT",
          "multiplier": 1,
          "aggregation": "last",
          "index": 2
        },
        {
          "name": "ac_current_total",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "last",
          "index": 3
        },
        {
          "name": "ac_current_an",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 4
        },
        {
          "name": "ac_current_bn",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 5
        },
        {
          "name": "ac_current_cn",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 6
        },
        {
          "name": "ac_voltage_ab",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 7
        },
        {
          "name": "ac_voltage_bc",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 8
        },
        {
          "name": "ac_voltage_ca",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 9
        },
        {
          "name": "ac_voltage_an",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 10
        },
        {
          "name": "ac_voltage_bn",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 11
        },
        {
          "name": "ac_voltage_cn",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 12
        },
        {
          "name": "frequency",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 13
        },
        {
          "name": "apparent_power",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 14
        },
        {
          "name": "reactive_power",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 15
        },
        {
          "name": "power_factor",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "last",
          "index": 16
        },
        {
          "name": "dc_input_current_1",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 17
        },
        {
          "name": "dc_input_voltage_1",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 18
        },
        {
          "name": "dc_input_power_1",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 19
        },
        {
          "name": "temperature_inv",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 20
        },
        {
          "name": "status",
          "type": "UINT",
          "multiplier": 1,
          "aggregation": "last",
          "index": 21
        }
      ],
      "rtu": [
        {
          "name": "Genel_Automat",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "H03_RelComF",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "reg_2032177",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "GENEL_TimeSignalInvalid",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "H04_Uan",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "H04_Ubn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "H04_Ucn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "H04_TripOV_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "H04_TripOV_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "H04_TripOV_3",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "H04_TripLV_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "H04_TripLV_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "H04_TripOV_4",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "H04_TripHF_P_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "H04_TripHF_P_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "H04_TripLF_P_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "H04_TripLF_P_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "H04_Trip50BF",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "H04_ProtecRelay_Fault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "H04_TripProtecRela",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "H04_CB_Fault74TC",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "H04_CB_Maint_Warning",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 21
        },
        {
          "name": "H04_TripMCB",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 22
        },
        {
          "name": "H04_SpringSet",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 23
        },
        {
          "name": "H04_RemoteOnOff_Error",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 24
        },
        {
          "name": "H04_TimeSync_Error",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 25
        },
        {
          "name": "H04_ROCOF",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 26
        },
        {
          "name": "GENEL_CommError",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 27
        },
        {
          "name": "H04_F",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 28
        },
        {
          "name": "H04_RelayTripCount",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 29
        },
        {
          "name": "H04_CBSwitchCount",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 30
        },
        {
          "name": "H02_Uan",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 31
        },
        {
          "name": "H02_Ubn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 32
        },
        {
          "name": "H02_Ucn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 33
        },
        {
          "name": "H02_U1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 34
        },
        {
          "name": "H02_U2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 35
        },
        {
          "name": "H02_U3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 36
        },
        {
          "name": "H02_Frequ",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 37
        },
        {
          "name": "H02_Thd_V1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 38
        },
        {
          "name": "H02_Thd_V2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 39
        },
        {
          "name": "H02_Thd_V3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 40
        },
        {
          "name": "H02_I1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 41
        },
        {
          "name": "H02_I2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 42
        },
        {
          "name": "H02_I3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 43
        },
        {
          "name": "H02_Thd_I1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 44
        },
        {
          "name": "H02_Thd_I2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 45
        },
        {
          "name": "H02_Thd_I3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 46
        },
        {
          "name": "H02_Pwr",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 47
        },
        {
          "name": "H02_ReactivePwr",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 48
        },
        {
          "name": "H02_S",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 49
        },
        {
          "name": "H02_CosPhi",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 50
        },
        {
          "name": "H02_Meas_PF",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 51
        },
        {
          "name": "H02_Meas_Wp_PLC_Imp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 52
        },
        {
          "name": "H02_Meas_Wp_PLC_Exp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 53
        },
        {
          "name": "H02_Wq_Inductive",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 54
        },
        {
          "name": "H02_Wq_Capacitive",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 55
        },
        {
          "name": "H02_Plt_IL1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 56
        },
        {
          "name": "H02_Plt_IL2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 57
        },
        {
          "name": "H02_Plt_IL3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 58
        },
        {
          "name": "H02_Pst_IL1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 59
        },
        {
          "name": "H02_Pst_IL2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 60
        },
        {
          "name": "H02_Pst_IL3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 61
        },
        {
          "name": "H02_TDD_IL1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 62
        },
        {
          "name": "H02_TDD_IL2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 63
        },
        {
          "name": "GENEL_QRComFault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 64
        },
        {
          "name": "CONV_PowerLevel1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 65
        },
        {
          "name": "CONV_PowerLevel2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 66
        },
        {
          "name": "CONV_PowerLevel3",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 67
        },
        {
          "name": "CONV_PowerLevel4",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 68
        },
        {
          "name": "CONV_PowerLevel_Percent",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 69
        },
        {
          "name": "CONV_PowerLevel_Reset",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 70
        },
        {
          "name": "H01_CB_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 71
        },
        {
          "name": "H01_Iso_Eth_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 72
        },
        {
          "name": "H01_SpringSet",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 73
        },
        {
          "name": "H01_Iso_Bb_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 74
        },
        {
          "name": "H01_Ia",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 75
        },
        {
          "name": "H01_Ib",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 76
        },
        {
          "name": "H01_Ic",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 77
        },
        {
          "name": "H01_I_Neutral",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 78
        },
        {
          "name": "H01_Ia_FaultCurrent",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 79
        },
        {
          "name": "H01_Ib_FaultCurrent",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 80
        },
        {
          "name": "H01_Ic_FaultCurrent",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 81
        },
        {
          "name": "H01_Uan",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 82
        },
        {
          "name": "H01_Ubn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 83
        },
        {
          "name": "H01_Ucn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 84
        },
        {
          "name": "H01_U1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 85
        },
        {
          "name": "H01_U2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 86
        },
        {
          "name": "H01_U3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 87
        },
        {
          "name": "H01_P",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 88
        },
        {
          "name": "H01_Q",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 89
        },
        {
          "name": "H01_S",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 90
        },
        {
          "name": "H01_F",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 91
        },
        {
          "name": "H01_CosPhi",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 92
        },
        {
          "name": "H03_Iso_Bb_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 93
        },
        {
          "name": "H03_I_Neutral",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 94
        },
        {
          "name": "H03_Ic_FaultCurrent_Neutral",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 95
        },
        {
          "name": "H03_Uan",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 96
        },
        {
          "name": "H03_Ubn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 97
        },
        {
          "name": "H03_Ucn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 98
        },
        {
          "name": "H03_U1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 99
        },
        {
          "name": "H03_U2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 100
        },
        {
          "name": "H03_U3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 101
        },
        {
          "name": "H03_P",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 102
        },
        {
          "name": "H03_Q",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 103
        },
        {
          "name": "H03_S",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 104
        },
        {
          "name": "H03_F",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 105
        },
        {
          "name": "H03_CosPhi",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 106
        },
        {
          "name": "Rectifier_DCLow",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 107
        },
        {
          "name": "GENEL_PIR_Offline",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 108
        },
        {
          "name": "GENEL_Fault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 109
        },
        {
          "name": "Sync_Fault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 110
        },
        {
          "name": "Digital_Input_Error",
          "type": "bit",
          "multiplier": 1,
          "aggregation": "",
          "index": 111
        }
      ]
    }
  },
  "Diyarbakir": {
    "Cva10": {
      "analizor": [
        {
          "name": "q1;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "q2;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "q3;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "q4;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "current_l1;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "current_l2;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "current_l3",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "frequency;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "voltage_l1;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "voltage_l2;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "voltage_l3;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "voltage_l12;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "voltage_l23;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "voltage_l31;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "p;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "q;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "s;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "wp_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "wp_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "wq_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "wq_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "power_factor",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "",
          "index": 21
        }
      ],
      "inverter": [
        {
          "name": "Status_vendor",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 0
        },
        {
          "name": "Status_operating",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 1
        },
        {
          "name": "Major_alarm",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 2
        },
        {
          "name": "Major_alarm_2",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 3
        },
        {
          "name": "Major_alarm_3",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 4
        },
        {
          "name": "DC_input_voltage_1",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 5
        },
        {
          "name": "DC_input_current_1",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 6
        },
        {
          "name": "DC_input_voltage_2",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 7
        },
        {
          "name": "DC_input_current_2",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 8
        },
        {
          "name": "DC_input_voltage_3",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 9
        },
        {
          "name": "DC_input_current_3",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 10
        },
        {
          "name": "DC_input_voltage_4",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 11
        },
        {
          "name": "DC_input_current_4",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 12
        },
        {
          "name": "DC_input_voltage_5",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 13
        },
        {
          "name": "DC_input_current_5",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 14
        },
        {
          "name": "DC_input_voltage_6",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 15
        },
        {
          "name": "DC_input_current_6",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 16
        },
        {
          "name": "DC_input_voltage_7",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 17
        },
        {
          "name": "DC_input_current_7",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 18
        },
        {
          "name": "DC_input_voltage_8",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 19
        },
        {
          "name": "DC_input_current_8",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 20
        },
        {
          "name": "DC_input_voltage_9",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 21
        },
        {
          "name": "DC_input_current_9",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 22
        },
        {
          "name": "DC_input_voltage_10",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 23
        },
        {
          "name": "DC_input_current_10",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 24
        },
        {
          "name": "DC_input_voltage_11",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 25
        },
        {
          "name": "DC_input_current_11",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 26
        },
        {
          "name": "DC_input_voltage_12",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 27
        },
        {
          "name": "DC_input_current_12",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 28
        },
        {
          "name": "DC_input_voltage_13",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 29
        },
        {
          "name": "DC_input_current_13",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 30
        },
        {
          "name": "DC_input_voltage_14",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 31
        },
        {
          "name": "DC_input_current_14",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 32
        },
        {
          "name": "DC_input_voltage_15",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 33
        },
        {
          "name": "DC_input_current_15",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 34
        },
        {
          "name": "DC_input_voltage_16",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 35
        },
        {
          "name": "DC_input_current_16",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 36
        },
        {
          "name": "DC_input_voltage_17",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 37
        },
        {
          "name": "DC_input_current_17",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 38
        },
        {
          "name": "DC_input_voltage_18",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 39
        },
        {
          "name": "DC_input_current_18",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 40
        },
        {
          "name": "DC_input_power_total",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 41
        },
        {
          "name": "AC_voltage_ab",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 42
        },
        {
          "name": "AC_voltage_bc",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 43
        },
        {
          "name": "AC_voltage_ca",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 44
        },
        {
          "name": "AC_voltage_an",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 45
        },
        {
          "name": "AC_voltage_bn",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 46
        },
        {
          "name": "AC_voltage_cn",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 47
        },
        {
          "name": "AC_current_an",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 48
        },
        {
          "name": "AC_current_bn",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 49
        },
        {
          "name": "AC_current_cn",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 50
        },
        {
          "name": "Active_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 51
        },
        {
          "name": "Reactive_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 52
        },
        {
          "name": "Power_factor",
          "type": "INT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 53
        },
        {
          "name": "Frequency",
          "type": "UINT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 54
        },
        {
          "name": "Efficiency",
          "type": "UINT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 55
        },
        {
          "name": "Temperature_inv",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 56
        },
        {
          "name": "isolation_resistance",
          "type": "UINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 57
        },
        {
          "name": "Status",
          "type": "UINT",
          "multiplier": 1,
          "aggregation": "last",
          "index": 58
        },
        {
          "name": "Total_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 59
        },
        {
          "name": "Daily_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 60
        },
        {
          "name": "Monthly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 61
        },
        {
          "name": "Yearly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 62
        }
      ],
      "rtu": [
        {
          "name": "reg_2031618",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "reg_2031620",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "reg_2031621",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "reg_2031622",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "reg_2031623",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "reg_2031624",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "reg_2031625",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "reg_2034433",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "reg_2034434",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "reg_2034435",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "reg_2034436",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "reg_2034437",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "reg_2034438",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "reg_2034439",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "reg_2034440",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "reg_2034441",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "reg_2034442",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "reg_2034443",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "reg_2034444",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "reg_2034445",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "reg_2034446",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "reg_2034447",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 21
        },
        {
          "name": "reg_2034448",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 22
        },
        {
          "name": "reg_2034449",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 23
        },
        {
          "name": "reg_2034450",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 24
        },
        {
          "name": "reg_2034451",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 25
        },
        {
          "name": "reg_2034452",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 26
        },
        {
          "name": "reg_2034453",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 27
        },
        {
          "name": "reg_2034454",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 28
        },
        {
          "name": "reg_2034455",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 29
        },
        {
          "name": "reg_2034456",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 30
        },
        {
          "name": "reg_2034457",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 31
        },
        {
          "name": "reg_2034458",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 32
        },
        {
          "name": "reg_2034459",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 33
        },
        {
          "name": "reg_2034460",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 34
        },
        {
          "name": "reg_2034461",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 35
        },
        {
          "name": "reg_2034462",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 36
        },
        {
          "name": "reg_2034463",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 37
        },
        {
          "name": "reg_2034481",
          "type": "float",
          "multiplier": 1,
          "aggregation": "",
          "index": 38
        }
      ]
    },
    "Cva12": {
      "analizor": [
        {
          "name": "q1;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "q2;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "q3;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "q4;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "current_l1;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "current_l2;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "current_l3",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "frequency;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "voltage_l1;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "voltage_l2;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "voltage_l3;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "voltage_l12;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "voltage_l23;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "voltage_l31;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "p;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "q;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "s;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "wp_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "wp_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "wq_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "wq_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "power_factor",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "",
          "index": 21
        }
      ],
      "inverter": [
        {
          "name": "Status_vendor",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 0
        },
        {
          "name": "Status_operating",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 1
        },
        {
          "name": "Major_alarm",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 2
        },
        {
          "name": "Major_alarm_2",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 3
        },
        {
          "name": "Major_alarm_3",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 4
        },
        {
          "name": "DC_input_voltage_1",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 5
        },
        {
          "name": "DC_input_current_1",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 6
        },
        {
          "name": "DC_input_voltage_2",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 7
        },
        {
          "name": "DC_input_current_2",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 8
        },
        {
          "name": "DC_input_voltage_3",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 9
        },
        {
          "name": "DC_input_current_3",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 10
        },
        {
          "name": "DC_input_voltage_4",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 11
        },
        {
          "name": "DC_input_current_4",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 12
        },
        {
          "name": "DC_input_voltage_5",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 13
        },
        {
          "name": "DC_input_current_5",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 14
        },
        {
          "name": "DC_input_voltage_6",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 15
        },
        {
          "name": "DC_input_current_6",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 16
        },
        {
          "name": "DC_input_voltage_7",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 17
        },
        {
          "name": "DC_input_current_7",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 18
        },
        {
          "name": "DC_input_voltage_8",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 19
        },
        {
          "name": "DC_input_current_8",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 20
        },
        {
          "name": "DC_input_voltage_9",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 21
        },
        {
          "name": "DC_input_current_9",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 22
        },
        {
          "name": "DC_input_voltage_10",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 23
        },
        {
          "name": "DC_input_current_10",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 24
        },
        {
          "name": "DC_input_voltage_11",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 25
        },
        {
          "name": "DC_input_current_11",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 26
        },
        {
          "name": "DC_input_voltage_12",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 27
        },
        {
          "name": "DC_input_current_12",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 28
        },
        {
          "name": "DC_input_voltage_13",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 29
        },
        {
          "name": "DC_input_current_13",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 30
        },
        {
          "name": "DC_input_voltage_14",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 31
        },
        {
          "name": "DC_input_current_14",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 32
        },
        {
          "name": "DC_input_voltage_15",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 33
        },
        {
          "name": "DC_input_current_15",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 34
        },
        {
          "name": "DC_input_voltage_16",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 35
        },
        {
          "name": "DC_input_current_16",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 36
        },
        {
          "name": "DC_input_voltage_17",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 37
        },
        {
          "name": "DC_input_current_17",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 38
        },
        {
          "name": "DC_input_voltage_18",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 39
        },
        {
          "name": "DC_input_current_18",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 40
        },
        {
          "name": "DC_input_power_total",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 41
        },
        {
          "name": "AC_voltage_ab",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 42
        },
        {
          "name": "AC_voltage_bc",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 43
        },
        {
          "name": "AC_voltage_ca",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 44
        },
        {
          "name": "AC_voltage_an",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 45
        },
        {
          "name": "AC_voltage_bn",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 46
        },
        {
          "name": "AC_voltage_cn",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 47
        },
        {
          "name": "AC_current_an",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 48
        },
        {
          "name": "AC_current_bn",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 49
        },
        {
          "name": "AC_current_cn",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 50
        },
        {
          "name": "Active_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 51
        },
        {
          "name": "Reactive_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 52
        },
        {
          "name": "Power_factor",
          "type": "INT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 53
        },
        {
          "name": "Frequency",
          "type": "UINT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 54
        },
        {
          "name": "Efficiency",
          "type": "UINT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 55
        },
        {
          "name": "Temperature_inv",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 56
        },
        {
          "name": "isolation_resistance",
          "type": "UINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 57
        },
        {
          "name": "Status",
          "type": "UINT",
          "multiplier": 1,
          "aggregation": "last",
          "index": 58
        },
        {
          "name": "Total_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 59
        },
        {
          "name": "Daily_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 60
        },
        {
          "name": "Monthly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 61
        },
        {
          "name": "Yearly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 62
        }
      ],
      "rtu": [
        {
          "name": "reg_2031618",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "reg_2031620",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "reg_2031621",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "reg_2031622",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "reg_2031623",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "reg_2031624",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "reg_2031625",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "reg_2034433",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "reg_2034434",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "reg_2034435",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "reg_2034436",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "reg_2034437",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "reg_2034438",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "reg_2034439",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "reg_2034440",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "reg_2034441",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "reg_2034442",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "reg_2034443",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "reg_2034444",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "reg_2034445",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "reg_2034446",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "reg_2034447",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 21
        },
        {
          "name": "reg_2034448",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 22
        },
        {
          "name": "reg_2034449",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 23
        },
        {
          "name": "reg_2034450",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 24
        },
        {
          "name": "reg_2034451",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 25
        },
        {
          "name": "reg_2034452",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 26
        },
        {
          "name": "reg_2034453",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 27
        },
        {
          "name": "reg_2034454",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 28
        },
        {
          "name": "reg_2034455",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 29
        },
        {
          "name": "reg_2034456",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 30
        },
        {
          "name": "reg_2034457",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 31
        },
        {
          "name": "reg_2034458",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 32
        },
        {
          "name": "reg_2034459",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 33
        },
        {
          "name": "reg_2034460",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 34
        },
        {
          "name": "reg_2034461",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 35
        },
        {
          "name": "reg_2034462",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 36
        },
        {
          "name": "reg_2034463",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 37
        },
        {
          "name": "reg_2034481",
          "type": "float",
          "multiplier": 1,
          "aggregation": "",
          "index": 38
        }
      ]
    },
    "Cva13": {
      "analizor": [
        {
          "name": "q1;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "q2;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "q3;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "q4;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "current_l1;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "current_l2;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "current_l3",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "frequency;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "voltage_l1;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "voltage_l2;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "voltage_l3;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "voltage_l12;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "voltage_l23;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "voltage_l31;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "p;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "q;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "s;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "wp_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "wp_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "wq_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "wq_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "power_factor",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "",
          "index": 21
        }
      ],
      "inverter": [
        {
          "name": "Status_vendor",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 0
        },
        {
          "name": "Status_operating",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 1
        },
        {
          "name": "Major_alarm",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 2
        },
        {
          "name": "Major_alarm_2",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 3
        },
        {
          "name": "Major_alarm_3",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 4
        },
        {
          "name": "DC_input_voltage_1",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 5
        },
        {
          "name": "DC_input_current_1",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 6
        },
        {
          "name": "DC_input_voltage_2",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 7
        },
        {
          "name": "DC_input_current_2",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 8
        },
        {
          "name": "DC_input_voltage_3",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 9
        },
        {
          "name": "DC_input_current_3",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 10
        },
        {
          "name": "DC_input_voltage_4",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 11
        },
        {
          "name": "DC_input_current_4",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 12
        },
        {
          "name": "DC_input_voltage_5",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 13
        },
        {
          "name": "DC_input_current_5",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 14
        },
        {
          "name": "DC_input_voltage_6",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 15
        },
        {
          "name": "DC_input_current_6",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 16
        },
        {
          "name": "DC_input_voltage_7",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 17
        },
        {
          "name": "DC_input_current_7",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 18
        },
        {
          "name": "DC_input_voltage_8",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 19
        },
        {
          "name": "DC_input_current_8",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 20
        },
        {
          "name": "DC_input_voltage_9",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 21
        },
        {
          "name": "DC_input_current_9",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 22
        },
        {
          "name": "DC_input_voltage_10",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 23
        },
        {
          "name": "DC_input_current_10",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 24
        },
        {
          "name": "DC_input_voltage_11",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 25
        },
        {
          "name": "DC_input_current_11",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 26
        },
        {
          "name": "DC_input_voltage_12",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 27
        },
        {
          "name": "DC_input_current_12",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 28
        },
        {
          "name": "DC_input_voltage_13",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 29
        },
        {
          "name": "DC_input_current_13",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 30
        },
        {
          "name": "DC_input_voltage_14",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 31
        },
        {
          "name": "DC_input_current_14",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 32
        },
        {
          "name": "DC_input_voltage_15",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 33
        },
        {
          "name": "DC_input_current_15",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 34
        },
        {
          "name": "DC_input_voltage_16",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 35
        },
        {
          "name": "DC_input_current_16",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 36
        },
        {
          "name": "DC_input_voltage_17",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 37
        },
        {
          "name": "DC_input_current_17",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 38
        },
        {
          "name": "DC_input_voltage_18",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 39
        },
        {
          "name": "DC_input_current_18",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 40
        },
        {
          "name": "DC_input_power_total",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 41
        },
        {
          "name": "AC_voltage_ab",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 42
        },
        {
          "name": "AC_voltage_bc",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 43
        },
        {
          "name": "AC_voltage_ca",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 44
        },
        {
          "name": "AC_voltage_an",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 45
        },
        {
          "name": "AC_voltage_bn",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 46
        },
        {
          "name": "AC_voltage_cn",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 47
        },
        {
          "name": "AC_current_an",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 48
        },
        {
          "name": "AC_current_bn",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 49
        },
        {
          "name": "AC_current_cn",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 50
        },
        {
          "name": "Active_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 51
        },
        {
          "name": "Reactive_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 52
        },
        {
          "name": "Power_factor",
          "type": "INT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 53
        },
        {
          "name": "Frequency",
          "type": "UINT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 54
        },
        {
          "name": "Efficiency",
          "type": "UINT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 55
        },
        {
          "name": "Temperature_inv",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 56
        },
        {
          "name": "isolation_resistance",
          "type": "UINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 57
        },
        {
          "name": "Status",
          "type": "UINT",
          "multiplier": 1,
          "aggregation": "last",
          "index": 58
        },
        {
          "name": "Total_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 59
        },
        {
          "name": "Daily_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 60
        },
        {
          "name": "Monthly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 61
        },
        {
          "name": "Yearly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 62
        }
      ],
      "rtu": [
        {
          "name": "reg_2031618",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "reg_2031620",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "reg_2031621",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "reg_2031622",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "reg_2031623",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "reg_2031624",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "reg_2031625",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "reg_2034433",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "reg_2034434",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "reg_2034435",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "reg_2034436",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "reg_2034437",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "reg_2034438",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "reg_2034439",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "reg_2034440",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "reg_2034441",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "reg_2034442",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "reg_2034443",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "reg_2034444",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "reg_2034445",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "reg_2034446",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "reg_2034447",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 21
        },
        {
          "name": "reg_2034448",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 22
        },
        {
          "name": "reg_2034449",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 23
        },
        {
          "name": "reg_2034450",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 24
        },
        {
          "name": "reg_2034451",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 25
        },
        {
          "name": "reg_2034452",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 26
        },
        {
          "name": "reg_2034453",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 27
        },
        {
          "name": "reg_2034454",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 28
        },
        {
          "name": "reg_2034455",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 29
        },
        {
          "name": "reg_2034456",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 30
        },
        {
          "name": "reg_2034457",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 31
        },
        {
          "name": "reg_2034458",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 32
        },
        {
          "name": "reg_2034459",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 33
        },
        {
          "name": "reg_2034460",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 34
        },
        {
          "name": "reg_2034461",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 35
        },
        {
          "name": "reg_2034462",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 36
        },
        {
          "name": "reg_2034463",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 37
        },
        {
          "name": "reg_2034481",
          "type": "float",
          "multiplier": 1,
          "aggregation": "",
          "index": 38
        }
      ]
    },
    "Cva14": {
      "analizor": [
        {
          "name": "q1;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "q2;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "q3;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "q4;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "current_l1;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "current_l2;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "current_l3",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "frequency;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "voltage_l1;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "voltage_l2;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "voltage_l3;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "voltage_l12;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "voltage_l23;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "voltage_l31;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "p;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "q;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "s;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "wp_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "wp_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "wq_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "wq_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "power_factor",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "",
          "index": 21
        }
      ],
      "inverter": [
        {
          "name": "Status_vendor",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 0
        },
        {
          "name": "Status_operating",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 1
        },
        {
          "name": "Major_alarm",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 2
        },
        {
          "name": "Major_alarm_2",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 3
        },
        {
          "name": "Major_alarm_3",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 4
        },
        {
          "name": "DC_input_voltage_1",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 5
        },
        {
          "name": "DC_input_current_1",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 6
        },
        {
          "name": "DC_input_voltage_2",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 7
        },
        {
          "name": "DC_input_current_2",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 8
        },
        {
          "name": "DC_input_voltage_3",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 9
        },
        {
          "name": "DC_input_current_3",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 10
        },
        {
          "name": "DC_input_voltage_4",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 11
        },
        {
          "name": "DC_input_current_4",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 12
        },
        {
          "name": "DC_input_voltage_5",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 13
        },
        {
          "name": "DC_input_current_5",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 14
        },
        {
          "name": "DC_input_voltage_6",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 15
        },
        {
          "name": "DC_input_current_6",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 16
        },
        {
          "name": "DC_input_voltage_7",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 17
        },
        {
          "name": "DC_input_current_7",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 18
        },
        {
          "name": "DC_input_voltage_8",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 19
        },
        {
          "name": "DC_input_current_8",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 20
        },
        {
          "name": "DC_input_voltage_9",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 21
        },
        {
          "name": "DC_input_current_9",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 22
        },
        {
          "name": "DC_input_voltage_10",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 23
        },
        {
          "name": "DC_input_current_10",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 24
        },
        {
          "name": "DC_input_voltage_11",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 25
        },
        {
          "name": "DC_input_current_11",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 26
        },
        {
          "name": "DC_input_voltage_12",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 27
        },
        {
          "name": "DC_input_current_12",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 28
        },
        {
          "name": "DC_input_voltage_13",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 29
        },
        {
          "name": "DC_input_current_13",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 30
        },
        {
          "name": "DC_input_voltage_14",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 31
        },
        {
          "name": "DC_input_current_14",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 32
        },
        {
          "name": "DC_input_voltage_15",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 33
        },
        {
          "name": "DC_input_current_15",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 34
        },
        {
          "name": "DC_input_voltage_16",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 35
        },
        {
          "name": "DC_input_current_16",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 36
        },
        {
          "name": "DC_input_voltage_17",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 37
        },
        {
          "name": "DC_input_current_17",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 38
        },
        {
          "name": "DC_input_voltage_18",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 39
        },
        {
          "name": "DC_input_current_18",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 40
        },
        {
          "name": "DC_input_power_total",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 41
        },
        {
          "name": "AC_voltage_ab",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 42
        },
        {
          "name": "AC_voltage_bc",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 43
        },
        {
          "name": "AC_voltage_ca",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 44
        },
        {
          "name": "AC_voltage_an",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 45
        },
        {
          "name": "AC_voltage_bn",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 46
        },
        {
          "name": "AC_voltage_cn",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 47
        },
        {
          "name": "AC_current_an",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 48
        },
        {
          "name": "AC_current_bn",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 49
        },
        {
          "name": "AC_current_cn",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 50
        },
        {
          "name": "Active_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 51
        },
        {
          "name": "Reactive_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 52
        },
        {
          "name": "Power_factor",
          "type": "INT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 53
        },
        {
          "name": "Frequency",
          "type": "UINT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 54
        },
        {
          "name": "Efficiency",
          "type": "UINT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 55
        },
        {
          "name": "Temperature_inv",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 56
        },
        {
          "name": "isolation_resistance",
          "type": "UINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 57
        },
        {
          "name": "Status",
          "type": "UINT",
          "multiplier": 1,
          "aggregation": "last",
          "index": 58
        },
        {
          "name": "Total_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 59
        },
        {
          "name": "Daily_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 60
        },
        {
          "name": "Monthly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 61
        },
        {
          "name": "Yearly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 62
        }
      ],
      "rtu": [
        {
          "name": "reg_2031618",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "reg_2031620",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "reg_2031621",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "reg_2031622",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "reg_2031623",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "reg_2031624",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "reg_2031625",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "reg_2034433",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "reg_2034434",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "reg_2034435",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "reg_2034436",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "reg_2034437",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "reg_2034438",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "reg_2034439",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "reg_2034440",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "reg_2034441",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "reg_2034442",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "reg_2034443",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "reg_2034444",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "reg_2034445",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "reg_2034446",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "reg_2034447",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 21
        },
        {
          "name": "reg_2034448",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 22
        },
        {
          "name": "reg_2034449",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 23
        },
        {
          "name": "reg_2034450",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 24
        },
        {
          "name": "reg_2034451",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 25
        },
        {
          "name": "reg_2034452",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 26
        },
        {
          "name": "reg_2034453",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 27
        },
        {
          "name": "reg_2034454",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 28
        },
        {
          "name": "reg_2034455",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 29
        },
        {
          "name": "reg_2034456",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 30
        },
        {
          "name": "reg_2034457",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 31
        },
        {
          "name": "reg_2034458",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 32
        },
        {
          "name": "reg_2034459",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 33
        },
        {
          "name": "reg_2034460",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 34
        },
        {
          "name": "reg_2034461",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 35
        },
        {
          "name": "reg_2034462",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 36
        },
        {
          "name": "reg_2034463",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 37
        },
        {
          "name": "reg_2034481",
          "type": "float",
          "multiplier": 1,
          "aggregation": "",
          "index": 38
        }
      ]
    },
    "Cva17": {
      "analizor": [
        {
          "name": "q1;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "q2;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "q3;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "q4;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "current_l1;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "current_l2;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "current_l3",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "frequency;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "voltage_l1;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "voltage_l2;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "voltage_l3;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "voltage_l12;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "voltage_l23;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "voltage_l31;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "p;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "q;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "s;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "wp_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "wp_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "wq_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "wq_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "power_factor",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "",
          "index": 21
        }
      ],
      "inverter": [
        {
          "name": "Status_vendor",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 0
        },
        {
          "name": "Status_operating",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 1
        },
        {
          "name": "Major_alarm",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 2
        },
        {
          "name": "Major_alarm_2",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 3
        },
        {
          "name": "Major_alarm_3",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 4
        },
        {
          "name": "DC_input_voltage_1",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 5
        },
        {
          "name": "DC_input_current_1",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 6
        },
        {
          "name": "DC_input_voltage_2",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 7
        },
        {
          "name": "DC_input_current_2",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 8
        },
        {
          "name": "DC_input_voltage_3",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 9
        },
        {
          "name": "DC_input_current_3",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 10
        },
        {
          "name": "DC_input_voltage_4",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 11
        },
        {
          "name": "DC_input_current_4",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 12
        },
        {
          "name": "DC_input_voltage_5",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 13
        },
        {
          "name": "DC_input_current_5",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 14
        },
        {
          "name": "DC_input_voltage_6",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 15
        },
        {
          "name": "DC_input_current_6",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 16
        },
        {
          "name": "DC_input_voltage_7",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 17
        },
        {
          "name": "DC_input_current_7",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 18
        },
        {
          "name": "DC_input_voltage_8",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 19
        },
        {
          "name": "DC_input_current_8",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 20
        },
        {
          "name": "DC_input_voltage_9",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 21
        },
        {
          "name": "DC_input_current_9",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 22
        },
        {
          "name": "DC_input_voltage_10",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 23
        },
        {
          "name": "DC_input_current_10",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 24
        },
        {
          "name": "DC_input_voltage_11",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 25
        },
        {
          "name": "DC_input_current_11",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 26
        },
        {
          "name": "DC_input_voltage_12",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 27
        },
        {
          "name": "DC_input_current_12",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 28
        },
        {
          "name": "DC_input_voltage_13",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 29
        },
        {
          "name": "DC_input_current_13",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 30
        },
        {
          "name": "DC_input_voltage_14",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 31
        },
        {
          "name": "DC_input_current_14",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 32
        },
        {
          "name": "DC_input_voltage_15",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 33
        },
        {
          "name": "DC_input_current_15",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 34
        },
        {
          "name": "DC_input_voltage_16",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 35
        },
        {
          "name": "DC_input_current_16",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 36
        },
        {
          "name": "DC_input_voltage_17",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 37
        },
        {
          "name": "DC_input_current_17",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 38
        },
        {
          "name": "DC_input_voltage_18",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 39
        },
        {
          "name": "DC_input_current_18",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 40
        },
        {
          "name": "DC_input_power_total",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 41
        },
        {
          "name": "AC_voltage_ab",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 42
        },
        {
          "name": "AC_voltage_bc",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 43
        },
        {
          "name": "AC_voltage_ca",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 44
        },
        {
          "name": "AC_voltage_an",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 45
        },
        {
          "name": "AC_voltage_bn",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 46
        },
        {
          "name": "AC_voltage_cn",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 47
        },
        {
          "name": "AC_current_an",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 48
        },
        {
          "name": "AC_current_bn",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 49
        },
        {
          "name": "AC_current_cn",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 50
        },
        {
          "name": "Active_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 51
        },
        {
          "name": "Reactive_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 52
        },
        {
          "name": "Power_factor",
          "type": "INT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 53
        },
        {
          "name": "Frequency",
          "type": "UINT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 54
        },
        {
          "name": "Efficiency",
          "type": "UINT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 55
        },
        {
          "name": "Temperature_inv",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 56
        },
        {
          "name": "isolation_resistance",
          "type": "UINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 57
        },
        {
          "name": "Status",
          "type": "UINT",
          "multiplier": 1,
          "aggregation": "last",
          "index": 58
        },
        {
          "name": "Total_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 59
        },
        {
          "name": "Daily_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 60
        },
        {
          "name": "Monthly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 61
        },
        {
          "name": "Yearly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 62
        }
      ],
      "rtu": [
        {
          "name": "reg_2031618",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "reg_2031620",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "reg_2031621",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "reg_2031622",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "reg_2031623",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "reg_2031624",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "reg_2031625",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "reg_2034433",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "reg_2034434",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "reg_2034435",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "reg_2034436",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "reg_2034437",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "reg_2034438",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "reg_2034439",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "reg_2034440",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "reg_2034441",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "reg_2034442",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "reg_2034443",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "reg_2034444",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "reg_2034445",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "reg_2034446",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "reg_2034447",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 21
        },
        {
          "name": "reg_2034448",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 22
        },
        {
          "name": "reg_2034449",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 23
        },
        {
          "name": "reg_2034450",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 24
        },
        {
          "name": "reg_2034451",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 25
        },
        {
          "name": "reg_2034452",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 26
        },
        {
          "name": "reg_2034453",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 27
        },
        {
          "name": "reg_2034454",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 28
        },
        {
          "name": "reg_2034455",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 29
        },
        {
          "name": "reg_2034456",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 30
        },
        {
          "name": "reg_2034457",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 31
        },
        {
          "name": "reg_2034458",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 32
        },
        {
          "name": "reg_2034459",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 33
        },
        {
          "name": "reg_2034460",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 34
        },
        {
          "name": "reg_2034461",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 35
        },
        {
          "name": "reg_2034462",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 36
        },
        {
          "name": "reg_2034463",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 37
        },
        {
          "name": "reg_2034481",
          "type": "float",
          "multiplier": 1,
          "aggregation": "",
          "index": 38
        }
      ]
    }
  },
  "Eskisehir": {
    "Akkul": {
      "analizor": [
        {
          "name": "q1;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "q2;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "q3;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "q4;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "current_l1;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "current_l2;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "current_l3",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "frequency;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "voltage_l1;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "voltage_l2;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "voltage_l3;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "voltage_l12;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "voltage_l23;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "voltage_l31;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "p;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "q;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "s;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "wp_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "wp_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "wq_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "wq_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "power_factor",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "",
          "index": 21
        }
      ],
      "inverter": [
        {
          "name": "dc_input_voltage_1",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 0
        },
        {
          "name": "dc_input_current_1",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 1
        },
        {
          "name": "dc_input_voltage_2",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 2
        },
        {
          "name": "dc_input_current_2",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 3
        },
        {
          "name": "dc_input_voltage_3",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 4
        },
        {
          "name": "dc_input_current_3",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 5
        },
        {
          "name": "dc_input_voltage_4",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 6
        },
        {
          "name": "dc_input_current_4",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 7
        },
        {
          "name": "dc_input_voltage_5",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 8
        },
        {
          "name": "dc_input_current_5",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 9
        },
        {
          "name": "dc_input_voltage_6",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 10
        },
        {
          "name": "dc_input_current_6",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 11
        },
        {
          "name": "ac_voltage_ab",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 12
        },
        {
          "name": "ac_voltage_bc",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 13
        },
        {
          "name": "ac_voltage_ca",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 14
        },
        {
          "name": "ac_voltage_an",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 15
        },
        {
          "name": "ac_voltage_bn",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 16
        },
        {
          "name": "ac_voltage_cn",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 17
        },
        {
          "name": "ac_current_an",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 18
        },
        {
          "name": "ac_current_bn",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 19
        },
        {
          "name": "ac_current_cn",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 20
        },
        {
          "name": "frequency",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 21
        },
        {
          "name": "efficiency",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 22
        },
        {
          "name": "temperature_inv",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 23
        },
        {
          "name": "active_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 24
        },
        {
          "name": "reactive_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 25
        },
        {
          "name": "dc_input_power_1",
          "type": "UDINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 26
        },
        {
          "name": "daily_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 27
        },
        {
          "name": "monthly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 28
        },
        {
          "name": "yearly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 29
        },
        {
          "name": "total_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 30
        },
        {
          "name": "dc_input_voltage_7",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 31
        },
        {
          "name": "dc_input_current_7",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 32
        },
        {
          "name": "dc_input_voltage_8",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 33
        },
        {
          "name": "dc_input_current_8",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 34
        },
        {
          "name": "State_1",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 35
        },
        {
          "name": "State_2",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 36
        },
        {
          "name": "State_3",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 37
        },
        {
          "name": "State_4",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 38
        },
        {
          "name": "isolation_resistance",
          "type": "UINT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 39
        }
      ],
      "rtu": [
        {
          "name": "reg_1000",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "reg_1001",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "reg_1003",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "reg_1007",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "reg_1008",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "reg_1010",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "reg_1019",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "reg_10000",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "H01_CB_Control",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "H03_DS_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "GENEL_LocRem",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "H03_ES_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "H03_Trip67P",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "H03_Trip67P_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "H01_Trip50N1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "H01_Trip50N2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "H01_CB_Fault74TC",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "H03_RelayFault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "H03_I1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "H03_I2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "H03_I3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "H03_Uan",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 21
        },
        {
          "name": "H03_Ubn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 22
        },
        {
          "name": "H03_Ucn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 23
        },
        {
          "name": "H03_U1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 24
        },
        {
          "name": "H03_U2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 25
        },
        {
          "name": "H03_U3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 26
        },
        {
          "name": "H03_Meas_Pwr",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 27
        },
        {
          "name": "H03_Meas_Q",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 28
        },
        {
          "name": "H03_Meas_S",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 29
        },
        {
          "name": "H03_Meas_PF",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 30
        },
        {
          "name": "reg_2031783",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 31
        },
        {
          "name": "H02_IN",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 32
        },
        {
          "name": "H02_DS_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 33
        },
        {
          "name": "H02_ES_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 34
        },
        {
          "name": "H01_ES_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 35
        },
        {
          "name": "H01_DS_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 36
        },
        {
          "name": "reg_2032649",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 37
        },
        {
          "name": "H02_U1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 38
        },
        {
          "name": "H02_U2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 39
        },
        {
          "name": "H02_U3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 40
        },
        {
          "name": "H02_Uan",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 41
        },
        {
          "name": "H02_Ubn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 42
        },
        {
          "name": "H02_Ucn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 43
        },
        {
          "name": "H02_Frequ",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 44
        },
        {
          "name": "H02_Thd_V1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 45
        },
        {
          "name": "H02_Thd_V2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 46
        },
        {
          "name": "H02_Thd_V3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 47
        },
        {
          "name": "H02_I1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 48
        },
        {
          "name": "H02_I2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 49
        },
        {
          "name": "H02_I3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 50
        },
        {
          "name": "H02_Thd_I1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 51
        },
        {
          "name": "H02_Thd_I2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 52
        },
        {
          "name": "H02_Thd_I3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 53
        },
        {
          "name": "H02_Meas_Pwr",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 54
        },
        {
          "name": "H02_Meas_Q",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 55
        },
        {
          "name": "H02_Meas_S",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 56
        },
        {
          "name": "H02_CosPhi",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 57
        },
        {
          "name": "H02_Meas_PF",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 58
        },
        {
          "name": "H02_Meas_Wp_Imp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 59
        },
        {
          "name": "H02_Meas_Wp_Exp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 60
        },
        {
          "name": "H02_Meas_Wq_Imp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 61
        },
        {
          "name": "H02_Meas_Wq_Exp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 62
        },
        {
          "name": "H02_Plt_IL1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 63
        },
        {
          "name": "H02_Plt_IL2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 64
        },
        {
          "name": "H02_Plt_IL3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 65
        },
        {
          "name": "H02_Pst_IL1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 66
        },
        {
          "name": "H02_Pst_IL2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 67
        },
        {
          "name": "H02_Pst_IL3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 68
        },
        {
          "name": "GENEL_FireAl",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 69
        },
        {
          "name": "Alm_Door_Open",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 70
        },
        {
          "name": "Rectifier_Fault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 71
        },
        {
          "name": "Rectifier_ACFault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 72
        },
        {
          "name": "Rectifier_DCFault",
          "type": "bit",
          "multiplier": 1,
          "aggregation": "",
          "index": 73
        }
      ]
    },
    "Cayli": {
      "analizor": [
        {
          "name": "q1;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "q2;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "q3;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "q4;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "current_l1;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "current_l2;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "current_l3",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "frequency;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "voltage_l1;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "voltage_l2;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "voltage_l3;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "voltage_l12;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "voltage_l23;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "voltage_l31;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "p;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "q;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "s;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "wp_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "wp_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "wq_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "wq_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "power_factor",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "",
          "index": 21
        }
      ],
      "inverter": [
        {
          "name": "dc_input_voltage_1",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 0
        },
        {
          "name": "dc_input_current_1",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 1
        },
        {
          "name": "dc_input_voltage_2",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 2
        },
        {
          "name": "dc_input_current_2",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 3
        },
        {
          "name": "dc_input_voltage_3",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 4
        },
        {
          "name": "dc_input_current_3",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 5
        },
        {
          "name": "dc_input_voltage_4",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 6
        },
        {
          "name": "dc_input_current_4",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 7
        },
        {
          "name": "dc_input_voltage_5",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 8
        },
        {
          "name": "dc_input_current_5",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 9
        },
        {
          "name": "dc_input_voltage_6",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 10
        },
        {
          "name": "dc_input_current_6",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 11
        },
        {
          "name": "ac_voltage_ab",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 12
        },
        {
          "name": "ac_voltage_bc",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 13
        },
        {
          "name": "ac_voltage_ca",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 14
        },
        {
          "name": "ac_voltage_an",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 15
        },
        {
          "name": "ac_voltage_bn",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 16
        },
        {
          "name": "ac_voltage_cn",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 17
        },
        {
          "name": "ac_current_an",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 18
        },
        {
          "name": "ac_current_bn",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 19
        },
        {
          "name": "ac_current_cn",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 20
        },
        {
          "name": "frequency",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 21
        },
        {
          "name": "efficiency",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 22
        },
        {
          "name": "temperature_inv",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 23
        },
        {
          "name": "active_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 24
        },
        {
          "name": "reactive_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 25
        },
        {
          "name": "dc_input_power_1",
          "type": "UDINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 26
        },
        {
          "name": "daily_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 27
        },
        {
          "name": "monthly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 28
        },
        {
          "name": "yearly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 29
        },
        {
          "name": "total_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 30
        },
        {
          "name": "dc_input_voltage_7",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 31
        },
        {
          "name": "dc_input_current_7",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 32
        },
        {
          "name": "dc_input_voltage_8",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 33
        },
        {
          "name": "dc_input_current_8",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 34
        },
        {
          "name": "State_1",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 35
        },
        {
          "name": "State_2",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 36
        },
        {
          "name": "State_3",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 37
        },
        {
          "name": "State_4",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 38
        },
        {
          "name": "isolation_resistance",
          "type": "UINT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 39
        }
      ],
      "rtu": [
        {
          "name": "reg_1000",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "reg_1001",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "reg_1003",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "reg_1007",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "reg_1008",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "reg_1010",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "reg_1019",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "reg_10000",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "H01_CB_Control",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "H03_DS_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "GENEL_LocRem",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "H03_ES_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "H03_Trip67P",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "H03_Trip67P_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "H01_Trip50N1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "H01_Trip50N2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "H01_CB_Fault74TC",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "H03_RelayFault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "H03_I1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "H03_I2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "H03_I3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "H03_Uan",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 21
        },
        {
          "name": "H03_Ubn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 22
        },
        {
          "name": "H03_Ucn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 23
        },
        {
          "name": "H03_U1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 24
        },
        {
          "name": "H03_U2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 25
        },
        {
          "name": "H03_U3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 26
        },
        {
          "name": "H03_Meas_Pwr",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 27
        },
        {
          "name": "H03_Meas_Q",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 28
        },
        {
          "name": "H03_Meas_S",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 29
        },
        {
          "name": "H03_Meas_PF",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 30
        },
        {
          "name": "reg_2031783",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 31
        },
        {
          "name": "H02_IN",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 32
        },
        {
          "name": "H02_DS_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 33
        },
        {
          "name": "H02_ES_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 34
        },
        {
          "name": "H01_ES_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 35
        },
        {
          "name": "H01_DS_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 36
        },
        {
          "name": "reg_2032649",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 37
        },
        {
          "name": "H02_U1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 38
        },
        {
          "name": "H02_U2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 39
        },
        {
          "name": "H02_U3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 40
        },
        {
          "name": "H02_Uan",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 41
        },
        {
          "name": "H02_Ubn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 42
        },
        {
          "name": "H02_Ucn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 43
        },
        {
          "name": "H02_Frequ",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 44
        },
        {
          "name": "H02_Thd_V1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 45
        },
        {
          "name": "H02_Thd_V2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 46
        },
        {
          "name": "H02_Thd_V3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 47
        },
        {
          "name": "H02_I1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 48
        },
        {
          "name": "H02_I2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 49
        },
        {
          "name": "H02_I3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 50
        },
        {
          "name": "H02_Thd_I1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 51
        },
        {
          "name": "H02_Thd_I2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 52
        },
        {
          "name": "H02_Thd_I3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 53
        },
        {
          "name": "H02_Meas_Pwr",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 54
        },
        {
          "name": "H02_Meas_Q",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 55
        },
        {
          "name": "H02_Meas_S",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 56
        },
        {
          "name": "H02_CosPhi",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 57
        },
        {
          "name": "H02_Meas_PF",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 58
        },
        {
          "name": "H02_Meas_Wp_Imp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 59
        },
        {
          "name": "H02_Meas_Wp_Exp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 60
        },
        {
          "name": "H02_Meas_Wq_Imp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 61
        },
        {
          "name": "H02_Meas_Wq_Exp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 62
        },
        {
          "name": "H02_Plt_IL1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 63
        },
        {
          "name": "H02_Plt_IL2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 64
        },
        {
          "name": "H02_Plt_IL3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 65
        },
        {
          "name": "H02_Pst_IL1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 66
        },
        {
          "name": "H02_Pst_IL2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 67
        },
        {
          "name": "H02_Pst_IL3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 68
        },
        {
          "name": "GENEL_FireAl",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 69
        },
        {
          "name": "Alm_Door_Open",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 70
        },
        {
          "name": "Rectifier_Fault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 71
        },
        {
          "name": "Rectifier_ACFault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 72
        },
        {
          "name": "Rectifier_DCFault",
          "type": "bit",
          "multiplier": 1,
          "aggregation": "",
          "index": 73
        }
      ]
    },
    "Ertokus": {
      "analizor": [
        {
          "name": "q1;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "q2;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "q3;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "q4;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "current_l1;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "current_l2;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "current_l3",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "frequency;",
          "type": "UINT",
          "multiplier": 0.1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "voltage_l1;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "voltage_l2;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "voltage_l3;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "voltage_l12;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "voltage_l23;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "voltage_l31;",
          "type": "UDINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "p;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "q;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "s;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "wp_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "wp_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "wq_imp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "wq_exp;",
          "type": "DINT",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "power_factor",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "",
          "index": 21
        }
      ],
      "inverter": [
        {
          "name": "dc_input_voltage_1",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 0
        },
        {
          "name": "dc_input_current_1",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 1
        },
        {
          "name": "dc_input_voltage_2",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 2
        },
        {
          "name": "dc_input_current_2",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 3
        },
        {
          "name": "dc_input_voltage_3",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 4
        },
        {
          "name": "dc_input_current_3",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 5
        },
        {
          "name": "dc_input_voltage_4",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 6
        },
        {
          "name": "dc_input_current_4",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 7
        },
        {
          "name": "dc_input_voltage_5",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 8
        },
        {
          "name": "dc_input_current_5",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 9
        },
        {
          "name": "dc_input_voltage_6",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 10
        },
        {
          "name": "dc_input_current_6",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 11
        },
        {
          "name": "ac_voltage_ab",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 12
        },
        {
          "name": "ac_voltage_bc",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 13
        },
        {
          "name": "ac_voltage_ca",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 14
        },
        {
          "name": "ac_voltage_an",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 15
        },
        {
          "name": "ac_voltage_bn",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 16
        },
        {
          "name": "ac_voltage_cn",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 17
        },
        {
          "name": "ac_current_an",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 18
        },
        {
          "name": "ac_current_bn",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 19
        },
        {
          "name": "ac_current_cn",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 20
        },
        {
          "name": "frequency",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 21
        },
        {
          "name": "efficiency",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 22
        },
        {
          "name": "temperature_inv",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 23
        },
        {
          "name": "active_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 24
        },
        {
          "name": "reactive_power",
          "type": "DINT",
          "multiplier": 0.001,
          "aggregation": "avg",
          "index": 25
        },
        {
          "name": "dc_input_power_1",
          "type": "UDINT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 26
        },
        {
          "name": "daily_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 27
        },
        {
          "name": "monthly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 28
        },
        {
          "name": "yearly_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 29
        },
        {
          "name": "total_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 30
        },
        {
          "name": "dc_input_voltage_7",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 31
        },
        {
          "name": "dc_input_current_7",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 32
        },
        {
          "name": "dc_input_voltage_8",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 33
        },
        {
          "name": "dc_input_current_8",
          "type": "INT",
          "multiplier": 0.1,
          "aggregation": "avg",
          "index": 34
        },
        {
          "name": "State_1",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 35
        },
        {
          "name": "State_2",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 36
        },
        {
          "name": "State_3",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 37
        },
        {
          "name": "State_4",
          "type": "STR",
          "multiplier": 1,
          "aggregation": "last",
          "index": 38
        },
        {
          "name": "isolation_resistance",
          "type": "UINT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 39
        }
      ],
      "rtu": [
        {
          "name": "reg_1000",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "reg_1001",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "reg_1003",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "reg_1007",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "reg_1008",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "reg_1010",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "reg_1019",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "reg_10000",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "H01_CB_Control",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "H03_DS_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "GENEL_LocRem",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "H03_ES_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "H03_Trip67P",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "H03_Trip67P_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "H01_Trip50N1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "H01_Trip50N2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "H01_CB_Fault74TC",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "H03_RelayFault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "H03_I1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "H03_I2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "H03_I3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "H03_Uan",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 21
        },
        {
          "name": "H03_Ubn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 22
        },
        {
          "name": "H03_Ucn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 23
        },
        {
          "name": "H03_U1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 24
        },
        {
          "name": "H03_U2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 25
        },
        {
          "name": "H03_U3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 26
        },
        {
          "name": "H03_Meas_Pwr",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 27
        },
        {
          "name": "H03_Meas_Q",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 28
        },
        {
          "name": "H03_Meas_S",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 29
        },
        {
          "name": "H03_Meas_PF",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 30
        },
        {
          "name": "reg_2031783",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 31
        },
        {
          "name": "H02_IN",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 32
        },
        {
          "name": "H02_DS_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 33
        },
        {
          "name": "H02_ES_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 34
        },
        {
          "name": "H01_ES_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 35
        },
        {
          "name": "H01_DS_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 36
        },
        {
          "name": "reg_2032649",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 37
        },
        {
          "name": "H02_U1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 38
        },
        {
          "name": "H02_U2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 39
        },
        {
          "name": "H02_U3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 40
        },
        {
          "name": "H02_Uan",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 41
        },
        {
          "name": "H02_Ubn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 42
        },
        {
          "name": "H02_Ucn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 43
        },
        {
          "name": "H02_Frequ",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 44
        },
        {
          "name": "H02_Thd_V1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 45
        },
        {
          "name": "H02_Thd_V2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 46
        },
        {
          "name": "H02_Thd_V3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 47
        },
        {
          "name": "H02_I1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 48
        },
        {
          "name": "H02_I2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 49
        },
        {
          "name": "H02_I3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 50
        },
        {
          "name": "H02_Thd_I1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 51
        },
        {
          "name": "H02_Thd_I2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 52
        },
        {
          "name": "H02_Thd_I3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 53
        },
        {
          "name": "H02_Meas_Pwr",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 54
        },
        {
          "name": "H02_Meas_Q",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 55
        },
        {
          "name": "H02_Meas_S",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 56
        },
        {
          "name": "H02_CosPhi",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 57
        },
        {
          "name": "H02_Meas_PF",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 58
        },
        {
          "name": "H02_Meas_Wp_Imp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 59
        },
        {
          "name": "H02_Meas_Wp_Exp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 60
        },
        {
          "name": "H02_Meas_Wq_Imp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 61
        },
        {
          "name": "H02_Meas_Wq_Exp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 62
        },
        {
          "name": "H02_Plt_IL1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 63
        },
        {
          "name": "H02_Plt_IL2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 64
        },
        {
          "name": "H02_Plt_IL3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 65
        },
        {
          "name": "H02_Pst_IL1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 66
        },
        {
          "name": "H02_Pst_IL2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 67
        },
        {
          "name": "H02_Pst_IL3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 68
        },
        {
          "name": "GENEL_FireAl",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 69
        },
        {
          "name": "Alm_Door_Open",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 70
        },
        {
          "name": "Rectifier_Fault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 71
        },
        {
          "name": "Rectifier_ACFault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 72
        },
        {
          "name": "Rectifier_DCFault",
          "type": "bit",
          "multiplier": 1,
          "aggregation": "",
          "index": 73
        }
      ]
    }
  },
  "Kirsehir": {
    "Efor5": {
      "analizor": [
        {
          "name": "Power_factor;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "Reactive_energy_ind;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "Reactive_energy_cap;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "H02_Meas_Q1;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "H02_Meas_Q3;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "H02_Meas_Q4;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "H02_Meas_Q2;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "Voltage_L1;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "Voltage_L2;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "Voltage_L3;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "Voltage_L12;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "Voltage_L23;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "Voltage_L31;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "Current_L1;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "Current_L2;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "Current_L3;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "H02_Meas_P;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "H02_Meas_Q;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "Frequency;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "H02_Meas_Wp_Imp;",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "H02_Meas_Wp_Exp",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        }
      ],
      "inverter": [
        {
          "name": "active_power",
          "type": "INT",
          "multiplier": 0.01,
          "aggregation": "avg",
          "index": 0
        },
        {
          "name": "total_energy",
          "type": "UDINT",
          "multiplier": 0.01,
          "aggregation": "last",
          "index": 1
        },
        {
          "name": "major_alarm",
          "type": "UINT",
          "multiplier": 1,
          "aggregation": "last",
          "index": 2
        },
        {
          "name": "ac_current_total",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "last",
          "index": 3
        },
        {
          "name": "ac_current_an",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 4
        },
        {
          "name": "ac_current_bn",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 5
        },
        {
          "name": "ac_current_cn",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 6
        },
        {
          "name": "ac_voltage_ab",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 7
        },
        {
          "name": "ac_voltage_bc",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 8
        },
        {
          "name": "ac_voltage_ca",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 9
        },
        {
          "name": "ac_voltage_an",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 10
        },
        {
          "name": "ac_voltage_bn",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 11
        },
        {
          "name": "ac_voltage_cn",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 12
        },
        {
          "name": "frequency",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 13
        },
        {
          "name": "apparent_power",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 14
        },
        {
          "name": "reactive_power",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 15
        },
        {
          "name": "power_factor",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "last",
          "index": 16
        },
        {
          "name": "dc_input_current_1",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 17
        },
        {
          "name": "dc_input_voltage_1",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 18
        },
        {
          "name": "dc_input_power_1",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 19
        },
        {
          "name": "temperature_inv",
          "type": "FLOAT",
          "multiplier": 1,
          "aggregation": "avg",
          "index": 20
        },
        {
          "name": "status",
          "type": "UINT",
          "multiplier": 1,
          "aggregation": "last",
          "index": 21
        }
      ],
      "rtu": [
        {
          "name": "Genel_Automat",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 0
        },
        {
          "name": "Genel_LocRem",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 1
        },
        {
          "name": "Alm_Door_Open",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 2
        },
        {
          "name": "GENEL_FireAl",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 3
        },
        {
          "name": "Rectifier_DCFault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 4
        },
        {
          "name": "Rectifier_DCHigh",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 5
        },
        {
          "name": "Rectifier_ACFault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 6
        },
        {
          "name": "Rectifier_Fault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 7
        },
        {
          "name": "H01_Trip50_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 8
        },
        {
          "name": "H01_Trip50_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 9
        },
        {
          "name": "H01_Trip50_Delayed",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 10
        },
        {
          "name": "H01_Trip50N1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 11
        },
        {
          "name": "H01_Trip50N2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 12
        },
        {
          "name": "H01_Trip50N1_Delayed",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 13
        },
        {
          "name": "H01_TripOV_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 14
        },
        {
          "name": "H01_TripOV_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 15
        },
        {
          "name": "H01_TripOV_3",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 16
        },
        {
          "name": "H01_TripLV_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 17
        },
        {
          "name": "H01_TripLV_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 18
        },
        {
          "name": "H01_TripOV_4",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 19
        },
        {
          "name": "H01_TripHF_P_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 20
        },
        {
          "name": "H01_TripHF_P_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 21
        },
        {
          "name": "H01_TripLF_P_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 22
        },
        {
          "name": "H01_TripLF_P_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 23
        },
        {
          "name": "H01_Trip_Reversephasebalance",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 24
        },
        {
          "name": "H01_Alarm_Reversephasebalance",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 25
        },
        {
          "name": "H01_TripOC_Rel",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 26
        },
        {
          "name": "H01_AlarmOC_Rel",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 27
        },
        {
          "name": "H01_Trip50BF",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 28
        },
        {
          "name": "H01_ProtecRelay_Fault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 29
        },
        {
          "name": "H01_CB_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 30
        },
        {
          "name": "H01_Iso_Bb_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 31
        },
        {
          "name": "H01_Iso_Eth_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 32
        },
        {
          "name": "H01_TripProtecRela",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 33
        },
        {
          "name": "H01_CB_Fault74TC",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 34
        },
        {
          "name": "H01_CB_Maint_Warning",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 35
        },
        {
          "name": "H01_TripMCB",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 36
        },
        {
          "name": "H01_RemoteOnOff_Error",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 37
        },
        {
          "name": "H01_TimeSync_Error",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 38
        },
        {
          "name": "H03_RelComF",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 39
        },
        {
          "name": "H01_la",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 40
        },
        {
          "name": "H01_lb",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 41
        },
        {
          "name": "H01_lc",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 42
        },
        {
          "name": "H01_l_Neutral",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 43
        },
        {
          "name": "H01_la_FaultCurrent",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 44
        },
        {
          "name": "H01_lb_FaultCurrent",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 45
        },
        {
          "name": "H01_lc_FaultCurrent",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 46
        },
        {
          "name": "H01_Uan",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 47
        },
        {
          "name": "H01_Ubn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 48
        },
        {
          "name": "H01_Ucn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 49
        },
        {
          "name": "H01_U1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 50
        },
        {
          "name": "H01_U2",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 51
        },
        {
          "name": "H01_U3",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 52
        },
        {
          "name": "H01_P",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 53
        },
        {
          "name": "H01_Q",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 54
        },
        {
          "name": "H01_F",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 55
        },
        {
          "name": "H01_CosPhi",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 56
        },
        {
          "name": "H01_Meas_Wp_PLC_Exp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 57
        },
        {
          "name": "H01_Meas_Wp_Imp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 58
        },
        {
          "name": "H01_WqExp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 59
        },
        {
          "name": "H01_WqImp",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 60
        },
        {
          "name": "H01_S",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 61
        },
        {
          "name": "H01_RelayTripCount",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 62
        },
        {
          "name": "H01_CBSwitchCount",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 63
        },
        {
          "name": "H02_Iso_Bb_1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 64
        },
        {
          "name": "H02_Iso_Eth_1",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 65
        },
        {
          "name": "H03_Trip50_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 66
        },
        {
          "name": "H03_Trip50_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 67
        },
        {
          "name": "H03_Trip50_Delayed",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 68
        },
        {
          "name": "H03_Trip50N1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 69
        },
        {
          "name": "H03_Trip50N2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 70
        },
        {
          "name": "H03_Trip50N1_Delayed",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 71
        },
        {
          "name": "H03_TripOV_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 72
        },
        {
          "name": "H03_TripOV_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 73
        },
        {
          "name": "H03_TripOV_3",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 74
        },
        {
          "name": "H03_TripLV_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 75
        },
        {
          "name": "H03_TripLV_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 76
        },
        {
          "name": "H03_TripOV_4",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 77
        },
        {
          "name": "H03_TripHF_P_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 78
        },
        {
          "name": "H03_TripHF_P_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 79
        },
        {
          "name": "H03_TripLF_P_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 80
        },
        {
          "name": "H03_TripLF_P_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 81
        },
        {
          "name": "H03_Trip_Reversephasebalance",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 82
        },
        {
          "name": "H03_Alarm_Reversephasebalance",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 83
        },
        {
          "name": "H03_TripRel",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 84
        },
        {
          "name": "H03_AlarmOC_Rel",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 85
        },
        {
          "name": "H03_Trip50BF",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 86
        },
        {
          "name": "H03_ProtecRelay_Fault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 87
        },
        {
          "name": "H03_CB_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 88
        },
        {
          "name": "H03_DS_Status",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 89
        },
        {
          "name": "H03_Iso_Eth1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 90
        },
        {
          "name": "H03_TripProtecRela",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 91
        },
        {
          "name": "H03_CB_Fault74TC",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 92
        },
        {
          "name": "H03_CB_Maint_Warning",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 93
        },
        {
          "name": "H03_TripMCB",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 94
        },
        {
          "name": "H03_RemoteOnOff_Error",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 95
        },
        {
          "name": "H03_TimeSync_Error",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 96
        },
        {
          "name": "H03_la",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 97
        },
        {
          "name": "H03_lb",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 98
        },
        {
          "name": "H03_lc",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 99
        },
        {
          "name": "H03_l_Neutral",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 100
        },
        {
          "name": "H03_la_FaultCurrent",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 101
        },
        {
          "name": "H03_lb_FaultCurrent",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 102
        },
        {
          "name": "H03_lc_FaultCurrent",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 103
        },
        {
          "name": "H03_RelayTripCount",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 104
        },
        {
          "name": "H03_CBSSwitchCount",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 105
        },
        {
          "name": "GENEL_CardFault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 106
        },
        {
          "name": "GENEL_TimeSignalFault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 107
        },
        {
          "name": "GENEL_TimeSignalInvalid",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 108
        },
        {
          "name": "GENEL_MainControlUnit",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 109
        },
        {
          "name": "H04_Uan",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 110
        },
        {
          "name": "H04_Ubn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 111
        },
        {
          "name": "H04_Ucn",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 112
        },
        {
          "name": "H04_TripOV_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 113
        },
        {
          "name": "H04_TripOV_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 114
        },
        {
          "name": "H04_TripOV_3",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 115
        },
        {
          "name": "H04_TripLV_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 116
        },
        {
          "name": "H04_TripLV_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 117
        },
        {
          "name": "H04_TripOV_4",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 118
        },
        {
          "name": "H04_TripHF_P_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 119
        },
        {
          "name": "H04_TripHF_P_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 120
        },
        {
          "name": "H04_TripLF_P_1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 121
        },
        {
          "name": "H04_TripLF_P_2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 122
        },
        {
          "name": "H04_Trip50BF",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 123
        },
        {
          "name": "H04_ProtecRelay_Fault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 124
        },
        {
          "name": "H04_TripProtecRela",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 125
        },
        {
          "name": "H04_CB_Fault74TC",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 126
        },
        {
          "name": "H04_CB_Maint_Warning",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 127
        },
        {
          "name": "H04_TripMCB",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 128
        },
        {
          "name": "H04_SpringSet",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 129
        },
        {
          "name": "H04_RemoteOnOff_Error",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 130
        },
        {
          "name": "H04_TimeSync_Error",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 131
        },
        {
          "name": "H04_ROCOF",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 132
        },
        {
          "name": "GENEL_CommError",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 133
        },
        {
          "name": "H04_F",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 134
        },
        {
          "name": "H04_RelayTripCount",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 135
        },
        {
          "name": "H04_CBSwitchCount",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 136
        },
        {
          "name": "GENEL_QRComFault",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 137
        },
        {
          "name": "CONV_PowerLevel1",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 138
        },
        {
          "name": "CONV_PowerLevel2",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 139
        },
        {
          "name": "CONV_PowerLevel3",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 140
        },
        {
          "name": "CONV_PowerLevel4",
          "type": "bit;",
          "multiplier": 1,
          "aggregation": "",
          "index": 141
        },
        {
          "name": "CONV_PowerLevel_Percent",
          "type": "float;",
          "multiplier": 1,
          "aggregation": "",
          "index": 142
        },
        {
          "name": "CONV_PowerLevel_Reset",
          "type": "bit",
          "multiplier": 1,
          "aggregation": "",
          "index": 143
        }
      ]
    }
  }
};

// Yardımcı fonksiyonlar
function getDataValue(data, ilName, gesName, deviceType, fieldName) {
  const config = deviceConfigs[ilName]?.[gesName]?.[deviceType]?.[fieldName];
  if (!config) {
    throw new Error('Invalid configuration: ' + ilName + '.' + gesName + '.' + deviceType + '.' + fieldName);
  }
  // Veri indeksini bul (config dosyasındaki sıraya göre)
  const fields = Object.keys(deviceConfigs[ilName][gesName][deviceType]);
  const index = fields.indexOf(fieldName);
  if (index === -1) {
    throw new Error('Field not found: ' + fieldName);
  }
  const rawValue = data[index + 1]; // +1 because first element is timestamp
  return rawValue * config.multiplier;
}

function getAvailableFields(ilName, gesName, deviceType) {
  return Object.keys(deviceConfigs[ilName]?.[gesName]?.[deviceType] || {});
}

function getDeviceTypes(ilName, gesName) {
  return Object.keys(deviceConfigs[ilName]?.[gesName] || {});
}

function getGesList(ilName) {
  return Object.keys(deviceConfigs[ilName] || {});
}

function getIlList() {
  return Object.keys(deviceConfigs);
}

module.exports = {
  deviceConfigs,
  getDataValue,
  getAvailableFields,
  getDeviceTypes,
  getGesList,
  getIlList
};
